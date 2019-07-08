import createImageEmbedTooltip from '../ui/image-embed-tooltip';

export default Quill => class ImageEmbed {
  static NAME = 'imageEmbed';

  constructor(quill, options = {}) {
    this.quill = quill;
    quill.tooltips = quill.tooltips = {};
    const bounds = quill.options.bounds;
    const ImageEmbedTooltip = createImageEmbedTooltip(Quill);
    quill.tooltips.imageEmbed = new ImageEmbedTooltip(quill, bounds, options);
  }
};
