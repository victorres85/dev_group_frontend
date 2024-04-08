// import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import capitalize  from '../../../../../utils/capitalize';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const SoftwareTable = ({companiesNames, softwares, displaySoftware }) => {
  const user = JSON.parse(localStorage.getItem('user_data'));  
  return (
        <div className="card overflow-hidden">
          <div className="card-header" style={{zIndex:1}}>
            <div className="row justify-content-between">
              {user.is_superuser ?
                <div>
                  <Link to={{ pathname: "/softwares/add-software" }}>
                    <span className="col-3 btn btn-secondary btn-sm">Add Software</span> 
                  </Link> 
                </div>
                : 
                <div className="col-2"></div> 
              }
            </div>
          </div>
          <div className="card-body">
            <table className='table'>
              <thead>
                <tr className="border-bottom border border-primary border-top-0 border-end-0 border-start-0 w-100">
                  <th scope="col-2"> <h6 className='mb-0'>Company</h6></th>
                  <th scope="col-3"> <h6 className='mb-0'>Name</h6></th>
                  <th scope="col-3"> <h6 className='mb-0'>Type</h6></th>
                  <th scope="col-2"> <h6 className='mb-0'>Client</h6></th>
                  <th scope="col-2"> <h6 className='mb-0'>Website</h6></th>
                </tr>
              </thead>
                {Array.isArray(companiesNames) &&
                companiesNames.map(companyName => {
                const filteredSoftwares = softwares && softwares.filter(software => software.company.name.toLowerCase() === companyName.toLowerCase());
                return (
                  <tbody key={companyName}>
                    {Array.isArray(filteredSoftwares) && filteredSoftwares.map((software) => (
                    <tr key={software.uid} onMouseOver={()=> displaySoftware(software)} className="border border-primary border-top-0 border-end-0 border-start-0 w-100" style={{cursor:'pointer'}}>
                      <td>
                        <p className="mb-0"> <strong> {capitalize(software.company.name)} </strong> </p>
                      </td>
                      <td>
                        <a className="mb-0" href={'/softwares/'+ software.uid}>
                          <strong>
                            {capitalize(software.name)}
                          </strong>
                        </a>
                      </td>
                      <td>
                        <p className="mb-0"> {capitalize(software.project_type)}</p>
                      </td>
                      <td>
                        <p className="mb-0"> {software.client.toUpperCase()}</p>
                      </td>
                      <td>
                        <a href={software.link} target="_blank" rel="noreferrer" className="mb-0"> Website </a>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                  )
                })
                }
            </table>
          </div>
        </div>
  );
}

export default SoftwareTable;