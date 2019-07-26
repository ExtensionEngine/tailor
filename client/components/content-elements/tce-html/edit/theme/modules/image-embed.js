import createImageEmbedTooltip from '../ui/image-embed-tooltip';

export default Quill => class ImageEmbed extends Quill.import('core/module') {
  static NAME = 'imageEmbed';

  constructor(quill, options = {}) {
    super(quill, options);
    const { bounds } = quill.options;
    const ImageEmbedTooltip = createImageEmbedTooltip(Quill);
    quill.tooltips = quill.tooltips || {};
    quill.tooltips.imageEmbed = new ImageEmbedTooltip(quill, bounds, options);
  }
};
