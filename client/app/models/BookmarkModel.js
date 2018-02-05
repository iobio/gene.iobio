class BookmarkModel {
  constructor() {
    this.bookmarks = [];
  }

  addBookmark(variant, gene) {
    if (!this.exists(variant)) {
      variant.isBookmark = true;
      this.bookmarks.push({'gene': gene, 'variant': variant, 'isFavorite': false});
    }
  }

  removeBookmark(bookmark) {
    var idx = this.getIndex(bookmark.variant);
    if (idx >= 0) {
      bookmark.variant.isBookmark = false;
      this.bookmarks.splice(idx,1);
    }
  }

  exists(variant) {
    let self = this;
    return this.bookmarks.filter(function(bookmark) {
      return self.getKey(bookmark) == self.getKey({'variant': variant});
    }).length > 0;
  }

  getIndex(variant) {
    let self = this;
    var index = null;
    var i = 0;
    this.bookmarks.forEach(function(bookmark) {
      if (index == null && self.getKey(bookmark) == self.getKey({'variant': variant})) {
        index = i;
      }
      i++;
    });
    return index == null ?  -1 : index;
  }

  getKey(bookmark) {
    return bookmark.variant.chrom + ":" + bookmark.variant.start + ":" + bookmark.variant.ref + ":" + bookmark.variant.alt;
  }

}

export default BookmarkModel;