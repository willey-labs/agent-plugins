(function () {
  function overflows(page) {
    var box = page.getBoundingClientRect();
    var footer = page.querySelector('footer');
    var limit = footer ? footer.getBoundingClientRect().top - 4 : box.bottom - 2;
    return Array.prototype.some.call(page.querySelectorAll('*'), function (el) {
      if (el.closest('footer')) return false;
      var r = el.getBoundingClientRect();
      return r.height > 0 && (r.bottom > limit + 0.5 || r.right > box.right + 0.5);
    });
  }

  function check() {
    var names = Array.prototype.filter.call(document.querySelectorAll('.page'), overflows).map(function (page) {
      return page.getAttribute('data-name');
    });
    document.body.setAttribute('data-overflow', names.join('|'));
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(check);
})();
