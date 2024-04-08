import { useParams } from 'react-router-dom';
import capitalize  from '../../../utils/capitalize';
import { getIconClass } from '../../../utils/getIconClass';
import PropTypes from 'prop-types';
import twitterXIcon  from 'bootstrap-icons/icons/twitter-x.svg';
import githubIcon from 'bootstrap-icons/icons/github.svg';
import linkedinIcon from 'bootstrap-icons/icons/linkedin.svg';
import baseUrl from '../../baseUrl';
import { useState, useEffect } from 'react';
import Loading from '../Loading';


const UserProfile = () => {
  const { employeeUid } = useParams();
  const [ employee, setEmployee ]  = useState()
  const [isLoading, setIsLoading] = useState(true); 

  const bUrl = baseUrl()

  async function fetchUser() {
    try {
      const response = await fetch( bUrl+`/api/user/`+employeeUid, {
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
    async function getEmployee() {
      const employeeData = await fetchUser();
      setEmployee(JSON.parse(employeeData));
    }
    getEmployee();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  if (!employee) {
    return <p>Person not found</p>;
  }
  const { 
    name,
    picture,
    bio,
    email,
    role,
    joined,
    company,
    softwares,
    stacks,
    twitter,
    github,
    linkedin
    // active,
    // superuser
  } = employee;
  
  UserProfile.propTypes = {
    name: PropTypes.string.isRequired,
  };

  return (
    <>
    <div className="row">
      <div className="col-12 col-lg-8 col-xl-9">
        <div className="card overflow-hidden">
          <div className="profile-cover bg-dark position-relative mb-4">
            <div className="user-profile-avatar shadow position-absolute top-50 start-0 translate-middle-x">
              <img loading='lazy' src={picture} alt={name} />
            </div>
          </div>
          <div className="card-body">
            <div className="mt-5 d-flex align-items-start justify-content-between">
              <div>
                <h3 className="mb-2">{capitalize(name)}</h3>
                <p className="mb-1">{capitalize(role)}
                { role && company.name ? ' | ' : '' }
                {capitalize(company.name)}
                </p>
                { joined ? <p> {'Since ' + joined} </p> : ''}
              </div>
              <div className='d-flex flex-column justify-content-end'>
                <div className="d-flex justify-content-end">
                  <a href={`mailto:${email}`} className="btn btn-primary"><i className="bi bi-chat me-2 pe-1"></i>Email</a>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  {twitter ? <a href={`https://${twitter}`} target='_blank' rel='noreferrer' className="btn btn-outline-primary ms-2"><img loading='lazy' src={twitterXIcon} alt=""/></a> : ''}
                  {linkedin ? <a href={`https://${linkedin}`} target='_blank' rel='noreferrer' className="btn btn-outline-primary ms-2"><img loading='lazy' src={linkedinIcon} alt=""/></a> : ''}
                  {github ? <a href={`https://${github}`} target='_blank' rel='noreferrer' className="btn btn-outline-primary ms-2"><img loading='lazy' src={githubIcon} alt=""/></a> : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        {bio && (
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">About Me</h4>
              <p>{bio.includes("# Welcome") ? "Biography has not been updated yet" : bio}</p>
            </div>
          </div>
        )}
      </div>
      <div className="col-12 col-lg-4 col-xl-3">
        <div className="card stacks">
          <div className="card-header">
              <h4 className="mb-0">Stacks</h4>
            </div>
            {
              Object.entries(stacks.reduce((grouped, stack) => {
                (grouped[stack.type] = grouped[stack.type] || []).push(stack);
                return grouped;
              }, {})).map(([type, stacks]) => (
                <div key={type} className="card-body">
                  <h3>{type}</h3>
                  <ul className="list-unstyled">
                    {stacks.map((stack, index) => (
                      <li key={index}>
                        <i className={getIconClass(type)}></i>
                        <strong>{capitalize(stack.name)}</strong>
                      </li>
                    ))}
                  </ul>
                </div> 
              ))
            }
          </div>

          <div className="card softwares">
            <div className="card-header">
              <h4 className="mb-0">Softwares</h4>
            </div>
            {softwares.map((software, index) => (
            <div key={index} className="card-body">
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-terminal me-2"></i>
                  <strong>{capitalize(software.name)}</strong>
                </li>
              </ul>
            </div>
            ))}
          </div>
      </div>
      </div>  
  </>
  );
};

export default UserProfile;