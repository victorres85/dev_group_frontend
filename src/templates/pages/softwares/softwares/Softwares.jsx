import { useState, useEffect } from 'react';
import { handleLocalStorage } from '../../../../utils/fetchData';
import Loading from '../../Loading';
import SoftwaresRightBar from './rightBar/SoftwaresRightBar';
import SoftwareTable from './softwareTable/softwareTable';

const Softwares = () => {
  var softwareList;
  try{ 
    softwareList = JSON.parse(localStorage.getItem('softwareList'));
  }catch (error){ 
    softwareList = null;
  }
  
  var companyList;
  try{
    companyList = JSON.parse(localStorage.getItem('companyList'));
  }catch (error){
    companyList = null;
  }
  const [companies, setCompanies] = useState();
  const [companiesNames, setCompaniesNames] = useState();
  const [softwares, setSoftwares] = useState();
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const fullScreen = window.innerWidth > 992;
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!softwareList){
    handleLocalStorage({ setObject: setSoftwares, data: softwareList, storageName: 'softwareList', endpoint: '/api/software/list'});
    }else{
      setSoftwares(softwareList);
    }
    if (!companyList){
      handleLocalStorage({ setObject: setCompanies, data: companyList, storageName: 'companyList', endpoint: '/api/company/list'});
    }else{
      setCompanies(companyList);
    }
  }, []);

  useEffect(() => {
    if (companies){
      setCompaniesNames(companies.map(company => company.name))
    }
  }, [companies]);

  useEffect(() => {
    if (companiesNames){
      setIsLoading(false);
    } 
  }, [companiesNames]);


  if (isLoading){
    return <Loading />
  }
  return (

    <div className="d-flex w-100 gap-5">
        <div className="feed">
          <SoftwareTable fullScreen={fullScreen}
                         companiesNames={companiesNames} 
                         softwares={softwares} 
                         displaySoftware={setSelectedSoftware} 
                         />
        </div>
      <SoftwaresRightBar selectedSoftware={selectedSoftware}/>
    </div>
  );
}

export default Softwares;