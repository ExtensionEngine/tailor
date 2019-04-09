const isProduction = process.env.NODE_ENV === 'production';

const isString = arg => typeof arg === 'string';
const isFileInput = el => el.tagName === 'INPUT' || el.type === 'file';

export const install = Vue => {
  const warn = (msg, vm) => Vue.util.warn(`[v-filefilter]: ${msg}`, vm);
  Vue.directive('filefilter', {
    inserted(el, { value }, { context: vm }) {
      if (!isFileInput(el)) {
        return !isProduction &&
          warn('Using directive on incompatible element; expected `input[type="file"]`.', vm);
      }
      if (!value) return !isProduction && warn('Missing required argument.', vm);
      if (Array.isArray(value)) return (el.accept = value.join(','));
      if (!isString(value)) {
        return !isProduction &&
          warn('Invalid argument type received; expected an Array or a String.', vm);
      }
      if (value !== 'auto') return (el.accept = value);
      // Construct `accept` property value from `vee-validate` rules.
      if (!vm.$validator) return;
      const specifiers = readSpecifiers(vm.$validator, { name: el.name });
      return (el.accept = specifiers.join(','));
    }
  });
};

export default install;

function readSpecifiers(validator, fieldMatcher) {
  const field = validator.fields.find(fieldMatcher);
  if (!field) return;
  // NOTE: According to: https://mdn.io/fileinput#accept this is
  //       comma-separated list of both extensions and mimetypes
  const specifiers = [];
  const { rules } = field;
  if (Array.isArray(rules.ext)) specifiers.push(...rules.ext);
  if (Array.isArray(rules.mimes)) specifiers.push(...rules.mimes);
  return specifiers;
}
