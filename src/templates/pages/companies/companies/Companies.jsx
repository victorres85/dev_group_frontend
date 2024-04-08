import { useState, useEffect } from 'react';
import { fetchData } from '../../../../utils/fetchData';
import { Link } from 'react-router-dom';
import { handleLocalStorage } from '../../../../utils/fetchData';
import Loading from '../../Loading';
import CompaniesForceGrapg from './rightBar/Components/CompaniesForceGrapgh';
import CompaniesRightBar from './rightBar/CompaniesRightBar';

const CompaniesssTable = () => {
  console.log('Companiessss')
  var companyList;
  try{
    companyList = JSON.parse(localStorage.getItem('companyList'))
  }catch{
    companyList = null
  }
  const [companies, setCompanies] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState()
  const user = JSON.parse(localStorage.getItem('user_data'))

  useEffect(() => {
    if (companyList){
      setCompanies(companyList)
    }else{
      handleLocalStorage({ setObject: setCompanies, data: companyList, storageName: 'companyList', endpoint: '/api/company/list'});
    }
  }, []);

  useEffect(() => {
    if (companies){
      setIsLoading(false)
    }
  },[companies]);


  
  const displayCompany = ((company)=>{
    console.log('displayCompany: ', company)
      let newCompany = companyList.find(c => c.uid === company.uid)
      console.log('newCompany: ', newCompany)
      if (newCompany){
        setSelectedCompany(newCompany)
        setIsLoading(false)
      }else{
        fetchData("/api/company/"+company.uid).then(data => {
          setSelectedCompany(data)
          setIsLoading(false)
        });
      }
  })


  if (isLoading){
    return <Loading/>
  }

  return (
      <div className="row align-items-start" id='div1'>
        <div style={{maxWidth: '720px'}} id='div2'>
          <div className="card overflow-hidden">
            <div className="card-header" style={{zIndex:1}}>
              <div className="row justify-content-between">
                {user.is_superuser ?
                  <div>
                    <Link to={{ pathname: "/companies/add-company" }}>
                      <span className="col-3 btn btn-secondary btn-sm" style={{zIndex:1}}>Add Company</span> 
                    </Link> 
                  </div>
                  : 
                  <div className="col-2"></div> 
                }
              </div>
            </div>
            <CompaniesForceGrapg companies={companies} setIsLoading={setIsLoading} displayCompany={displayCompany} />
          </div>
        </div>
        <CompaniesRightBar selectedCompany={selectedCompany} />
      </div>
  );
}

export default CompaniesssTable;