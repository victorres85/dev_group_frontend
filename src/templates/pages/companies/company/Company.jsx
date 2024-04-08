import BackgroundImage from '../../../../../public/assets/profile-bg.jpg';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import baseUrl from '../../../baseUrl';
import { useState, useEffect } from 'react';
import Loading from '../../Loading';



const CompanyInfo = () => {
  const { companyUid } = useParams();
  const [company, setCompany] = useState()
  const [isLoading, setIsLoading] = useState(true); 

  const bUrl = baseUrl()

  async function fetchCompany() {
    try {
      const response = await fetch( bUrl+`/api/company/`+companyUid, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setIsLoading(false);
      return JSON.stringify(data);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getCompany() {
      const employeeData = await fetchCompany();
      setCompany(JSON.parse(employeeData));
    }
    getCompany();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  if (!company) {
    return <p>Company not found</p>;
  }

  return (
    <div>
      <div className="row" style={{overflow:'auto', maxHeight:'100%'}}>
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card overflow-hidden">
            <div className="profile-cover bg-dark position-relative mb-4" style={{backgroundImage: `url(${BackgroundImage})`}}>
              <div className="user-profile-avatar shadow position-absolute top-50 start-0 translate-middle-x">
                <img src={company.logo} alt="1000heads" />
              </div>
            </div>
            <div className="card-body">
              <div className="mt-5 d-flex align-items-start justify-content-between">
                <div>
                  <h3 className="mb-2">{company.name}</h3>
                </div>
                <div>
                  <a href={company.website} target="_blank" className="btn btn-primary" rel="noreferrer" >
                    <i className="bi bi-globe2 me-2"></i>View Website
                  </a>
                </div>
              </div>
              <div>      
                <ReactMarkdown>{company.description}</ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="card staff">
            <div className="card-header">
              <h4 className="mb-0">People</h4>
            </div>
            <div className="card-body">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 row-cols-xxl-4">
              {company.employees.map((employee, index) => (
                <>
                <Link  key={index} to={`/people/${employee.uuid}`} className="col d-flex align-items-stretch unstyled">
                  <div className="card border-bottom border-0 border-4 shadow-sm border-primary w-100">
                    <div className="card-body text-center">
                      <div className="profile-img">
                        <img src={employee.picture} className="rounded-circle p-1 bg-primary" style={{width:100, height:100}} alt="Rob (Robert) Ford" />
                      </div>
                      <div className="mt-4">
                        <h5 className="mb-1">{employee.name}</h5>
                        <p className="mb-0">{employee.role}</p>
                      </div>
                    </div>
                  </div>
                </Link>
                </>
              ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="card locations">
            <div className="card-header">
              <h4 className="mb-0">Locations</h4>
            </div> 
            {company.locations.sort((a, b) => a.country.localeCompare(b.country)).map((location) => (
            <div key={location.uid} className="card-body">
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  <strong>{location.country}</strong><br/>
                  {location.city}<br/>
                  <ReactMarkdown>{location.address}</ReactMarkdown>
                </li>
              </ul>
            </div>
          ))}
          </div>
          <div className="card softwares">
            <div className="card-header">
              <h4 className="mb-0">Softwares</h4>
            </div>
            {company.softwares.map((software, index) => (
            <div key={index} className="card-body">
              <ul className="list--plain">
                <li>
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  <strong>{software.name}</strong>
                </li>
              </ul>
            </div>
            ))}
          </div>
          <div className="card stacks">
            <div className="card-header">
              <h4 className="mb-0">Stacks</h4>
            </div>
            {company.stacks.map((stack) => (
            <div key={stack.uid} className="card-body">
              <ul className="list--plain">
                <li>
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  <strong>{stack.name}</strong>
                </li>
              </ul>
            </div>
            ))}
          </div>
        </div>
      </div>  
    </div> 
  );
}

export default CompanyInfo;