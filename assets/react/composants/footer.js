import React from 'react';
import { Link } from 'react-router-dom';



function Footer() {
    return(
        <>
            <section className="call-to-action overly bg-3 section-sm">
                <div className="container">
                    <div className="row justify-content-md-center text-center">
                        <div className="col-md-8">
                            <div className="content-holder">
                                <h2>Rejoignez-nous en tant que vendeur, créez votre business .</h2>
                                <ul className="list-inline mt-30">
                                    <li className="list-inline-item"><Link className="btn btn-secondary" to=''>en savoir plus</Link></li>
                                    <li className="list-inline-item"><Link className="btn btn-secondary" to=''>suggestions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="footer section section-sm">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-3 col-md-7 offset-md-1 offset-lg-0 mb-4 mb-lg-0">
                        <div className="block about">
                            <img src="" alt="logo" />
                            <p className="alt-color">Blabla machin trucolition et bidule chouetologie, encore beaucoup de blabla et va que-ni ta reum sale filsdeup.
                            Et oui, y a des fortes chances que tu puisses arriver à cette partie mais je vais quand mếme poster ceci.</p>
                        </div>
                    </div>
                    <div className="col-lg-2 offset-lg-1 col-md-3 col-6 mb-4 mb-lg-0">
                        <div className="block">
                        <h4></h4>
                        <ul>
                            <li><Link to="dashboard-favourite-ads.html">Historique</Link></li>
                            <li><Link to="dashboard-archived-ads.html">Archives</Link></li>
                            <li><Link to="dashboard-pending-ads.html">Politique d'utilisation</Link></li>
                            <li><Link to="terms-condition.html">Termes & Conditions</Link></li>
                        </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 offset-md-1 offset-lg-0 col-6 mb-4 mb-md-0">
                        <div className="block">

                        </div>
                    </div>
                    <div className="col-lg-4 col-md-7">
                        <div className="block-2 app-promotion">
                            <div className="mobile d-flex  align-items-center">
                                <Link to="index.html">
                                    <img src="" alt="mobile-icon" />
                                </Link>
                                <p className="mb-0">merci d'avoir visité notre plateforme</p>
                            </div>
                        <div className="download-btn d-flex my-3">
                            <Link to="index.html"><img src="" className="img-fluid" alt="" /></Link>
                            <Link to="index.html" className=" ml-3"><img src="" className="img-fluid" alt="" /></Link>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </footer>
            <footer className="footer-bottom">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-6 text-center text-lg-left mb-3 mb-lg-0">
                        <div className="copyright">
                        <p>Copyright {/*&copy; <script>
                            var CurrentYear = new Date().getFullYear()
                            document.write(CurrentYear)
                            </script>.*/} Designed & Developed by <Link className="text-white" to="react/lino/">DOVAHKIN</Link></p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <ul className="social-media-icons text-center text-lg-right">
                        <li><Link to="https://www.facebook.com">{/* <i className="fa fa-facebook"></i> */}</Link></li>
                        <li><Link to="https://www.twitter.com">{/* <i className="fa fa-twitter"></i> */}</Link></li>
                        </ul>
                    </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;