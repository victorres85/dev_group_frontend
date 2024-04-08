function SearchModal() {
  return (
    <footer>
      <div className="overlay btn-toggle-menu"></div>
      <div className="modal" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header gap-2">
              <div className="position-relative popup-search w-100">
                <input className="form-control form-control-lg ps-5 border border-3 border-primary" type="search" placeholder="Search" />
                <span className="material-symbols-outlined position-absolute ms-3 translate-middle-y start-0 top-50">search</span>
              </div>
              <button type="button" className="btn-close d-xl-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="search-list">
                <p className="mb-1">Html Templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SearchModal;