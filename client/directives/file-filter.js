const isFileInput = el => el.tagName === 'INPUT' || el.type === 'file';

export const install = Vue => {
  Vue.directive('filefilter', (el, _, { context }) => {
    if (!isFileInput(el) || !context.$validator) return;
    const field = context.$validator.fields.find({ name: el.name });
    if (!field) return;
    // NOTE: According to: https://mdn.io/fileinput#accept this is
    //       comma-separated list of both extensions and mimetypes
    const specifiers = [];
    const { rules } = field;
    if (Array.isArray(rules.ext)) specifiers.push(...rules.ext);
    if (Array.isArray(rules.mimes)) specifiers.push(...rules.mimes);
    el.accept = specifiers.join(',');
  });
};

export default install;
