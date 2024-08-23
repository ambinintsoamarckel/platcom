import React from 'react';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

function AdvSearch() {
    return(
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="advance-search nice-select-white">
                        <form>
                            <div className="form-row align-items-center">
                                <div className="form-group col-xl-4 col-lg-3 col-md-6">
                                    <input type="text" className="form-control my-2 my-lg-0" id="inputtext4" placeholder="Que recherchez-vous ..." />
                                </div>
                                <div className="form-group col-lg-3 col-md-6">
                                    <select className="w-100 form-control my-2 my-lg-0">
                                        <option>Category</option>
                                        <option value="1">lololou</option>
                                        <option value="2">minanami</option>
                                        <option value="4">cabotare</option>
                                    </select>
                                </div>
                                <div className="form-group col-lg-3 col-md-6">
                                    <input type="text" className="form-control my-2 my-lg-0" id="inputLocation4" placeholder="Maimbo" />
                                </div>
                                <div className="form-group col-xl-2 col-lg-3 col-md-6">

                                    <button type="submit" className="btn btn-primary active w-100">Rechercher</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdvSearch;