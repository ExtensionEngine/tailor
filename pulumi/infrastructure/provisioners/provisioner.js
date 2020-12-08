'use strict';

const pulumi = require('@pulumi/pulumi');
const uuid = require('uuid');

// Provisioner lets a custom action run the first time a resource has been created.
// Anytime its value changes, the resource is replaced and will re-run its logic.
// https://github.com/pulumi/examples/blob/e942d6130c/aws-ts-ec2-provisioners/provisioners/provisioner.ts
class Provisioner extends pulumi.dynamic.Resource {
  constructor(name, props, opts = null) {
    const provider = {
      diff: (_id, olds, news) => {
        const replacementProperties = [];
        if (JSON.stringify(olds.dep) !== JSON.stringify(news.dep)) {
          replacementProperties.push('dep');
        }
        if (news.changeToken && olds.changeToken !== news.changeToken) {
          replacementProperties.push('changeToken');
        }
        const changes = Boolean(replacementProperties.length);
        return Promise.resolve({
          changes,
          replaces: changes ? replacementProperties : undefined,
          deleteBeforeReplace: true
        });
      },
      create: inputs => {
        return props.onCreate(inputs.dep)
          .then(result => result ? { ...inputs, result } : inputs)
          .then(outs => ({ id: uuid.v4(), outs }));
      }
    };
    super(provider, name, { dep: props.dep, result: null }, opts);
  }
}

module.exports = Provisioner;
