// import { useState, useEffect, useRef } from 'react';
// import capitalize  from '../../../utils/capitalize';
// import { fetchData } from '../../../utils/fetchData';
// import { Link } from 'react-router-dom';
// import { getIconClass } from '../../../utils/getIconClass';
// import { ForceGraph2D } from 'react-force-graph';
// import { handleLocalStorage } from '../../../utils/fetchData';
// import Loading from '../Loading';

// CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
//   if (w < 4 * r) r = w / 4;
//   if (h < 4 * r) r = h / 4;
//   this.beginPath();
//   this.moveTo(x+r, y);
//   this.arcTo(x+w, y,   x+w, y+h, r);
//   this.arcTo(x+w, y+h, x,   y+h, r);
//   this.arcTo(x,   y+h, x,   y,   r);
//   this.arcTo(x,   y,   x+w, y,   r);
//   this.closePath();
//   console.log()

//   return this;
// }


// const CompaniessTable = () => {
//   console.log('Companies')
//   const companyList = JSON.parse(localStorage.getItem('companyList'))
//   const [companies, setCompanies] = useState();
//   const [users, setUsers] = useState([]);
//   const [stacks, setStacks] = useState([]);
//   const [softwares, setSofwares] = useState([]);
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedCompany, setSelectedCompany] = useState([]);
//   const [isDiv3Open, setIsDiv3Open] = useState(false);
//   const fullScreen = window.innerWidth > 992;
//   const fgRef = useRef();

//   const user = JSON.parse(localStorage.getItem('user_data'))
//   const [graphData, setGraphData] = useState(null)
//   const [superuser, setSuperuser] = useState(false)
//   const [images, setImages] = useState({});
//   const [hoveredNode, setHoveredNode] = useState(null);

//   useEffect(() => {
//     handleLocalStorage({ setObject: setCompanies, data: companyList, storageName: 'companyList', endpoint: '/api/company/list'});
//   }, []);

//   useEffect(() => {
//     if (user.is_superuser){
//       setSuperuser(true)
//     }
//   }, [user.is_superuser]);

//   useEffect(() => {
//     if (companies){
//     const gData = {
//       nodes: companies.map(company => ({ id: company.name, logo: company.logo })),
//       links: companies.filter(company => company.name !== 'labelium').map(company => ({ source: 'labelium', target: company.name }))
//     };
//     setGraphData(gData)
//     setIsLoading(false)
//   }
//   }, [companies]);

//   useEffect(() => {
//     const imgs = {};
//     const waitForNodes = (async()=>{
//       while (graphData?.nodes === null){
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
//     })
//     waitForNodes().then(() => {
//     graphData?.nodes.forEach(node => {
//       const img = new Image();
//       img.src = node.logo;
//       img.onload = () => {
//         imgs[node.id] = img;
//         setImages(imgs);
//       };
//     });
//   });
//   }, [graphData]);
  
//   const displayCompany = ((company)=>{
//     if (selectedCompany){
//     fetchData("/api/company/"+company.uid).then(data => {
//       setStacks(data.stacks)
//       setUsers(data.employees)
//       setSofwares(data.softwares)
//       setSelectedCompany(data)});}
//   })

//   useEffect(() => {
//     if (fgRef.current) {
//       fgRef.current.zoom(5); // adjust the zoom level as needed
//     }
//   }, [graphData]);

//   if (isLoading){
//     return <Loading/>
//   }

//   return (
//       <div className="row align-items-start" id='div1'>
//         <div style={{maxWidth: fullScreen ? '720px' : '100%'}} id='div2'>
//           <div className="card overflow-hidden">
//             <div className="card-header" style={{zIndex:1}}>
//               <div className="row justify-content-between">
//                 {superuser ?
//                   <div>
//                     <Link to={{ pathname: "/companies/add-company" }}>
//                       <span className="col-3 btn btn-secondary btn-sm" style={{zIndex:1}}>Add Company</span> 
//                     </Link> 
//                   </div>
//                   : 
//                   <div className="col-2"></div> 
//                 }
//               </div>
//             </div>
//             <div className="card-body d-flex justify-content-center align-items-center" style={{maxHeight:600}}>
//               {graphData && 
//               <ForceGraph2D 
//               ref={fgRef}
//               graphData={graphData}
//               nodeAutoColorBy="id"
//               linkColor={()=> 'grey'}
//               linkWidth={()=> 2}
//               linkCurvature={()=> false}
//               nodeCanvasObject={(node, ctx) => {
//                 if (images[node.id]) {
//                   ctx.drawImage(images[node.id], node.x - 8, node.y - 8, 16, 16);
//                 }
//                 if (node === hoveredNode) {
//                   // Measure text
//                   const textWidth = ctx.measureText(node.id).width;
//                   ctx.beginPath();
//                   ctx.fillStyle = 'white';
//                   ctx.roundRect(node.x - ctx.measureText(node.id).width / 2 - 3, node.y + 10, textWidth+6, 6, 20);
//                   ctx.fill();
//                   // Draw text
//                   ctx.beginPath();
//                   ctx.fillStyle = 'black';
//                   ctx.font = '4px Arial';
//                   ctx.textAlign = 'center';
//                   ctx.textBaseline = 'hanging';
//                   ctx.fillText(node.id, node.x, node.y + 10 + 6 / 4);
//                 }
//               }}
//               nodeVal={2} 
//               onNodeHover={node => {
//                 document.body.style.cursor = node ? 'pointer' : null;
//                 if (node){
//                   let cp = companies.find(c => c?.name === node.id);
//                   displayCompany(cp)
//                 }
//                 try{
//                   setHoveredNode(node);
//                   setTimeout(()=>{
//                     setHoveredNode(node);
//                   },100)
//                 }
//                 catch{
//                   setHoveredNode(null);
//                 }
//               }}
//               onNodeClick={node =>{
//                 if (node){
//                   let cp = companies.find(c => c?.name === node.id);
//                   window.open('/companies/'+cp.uid);
//                 }
//               }}
//               style={{ width: '100%', height: '100%' }}
//             />
//             }
//             </div>
//           </div>
//         </div>
//         <div id="div3" className="col-12 col-lg-2 col-xl-2" style={{ maxWidth:'280px',maxHeight: fullScreen ? '100%' : isDiv3Open ? '60vh' : '48px', overflow: 'auto', position: fullScreen ? 'fixed' : 'sticky', bottom: 0, right: 20 }}>
//           <div className="card stack-info">
//             <div className="card-header d-flex flex-row justify-content-between align-items-center" id='div3head'>
//               <h4 className="mb-0">Company info:</h4>
//               {window.innerWidth < 992 ?
//               <div onClick={() => setIsDiv3Open(!isDiv3Open)} style={{ height: '40px' }}>{
//                     isDiv3Open ? 
//                     <i className="bi bi-caret-down rounded-5 mt-1 btn-toggle-up-down" style={{height:'20px', width:'20px'}}></i> 
//                     : 
//                     <i className="bi bi-caret-up mt-1 rounded-5 btn-toggle-up-down" style={{height:'20px', width:'20px'}}></i>
//                     }
//               </div> :
//               <div></div>
//               }
//             </div> 
//             <h3 className='mt-3 ms-3'>Users</h3>
//             {users && users.map((user, index) => (
//               <div key={index} className="card-body  p-0 ps-3 pt-2 mb-0 ms-3 mt-0 ">
//                 <ul className="list-unstyled mb-0 pb-0">
//                   <li className='ms-3 mb-0'>
//                     <strong className='mb-0'>{capitalize(user?.name)}</strong>
//                     </li>
//                 </ul>
//               </div>
//               ))
//             }
//             <h3 className='mt-2 ms-3 mb-0'>Softwares</h3>
//             {softwares && softwares.map((user, index) => (
//               <div key={index} className="card-body  p-0 ps-3 pt-2 mb-0 ms-3 mt-0 ">
//                 <ul className="list-unstyled mb-0 pb-1">
//                   <li className='ms-3 mb-0'>
//                     <strong className='mb-0'>{capitalize(user.name)}</strong>
//                     </li>
//                 </ul>
//               </div>
//               )) 
//             }
//             <h3 className='mt-2 ms-3 mb-0'>Stacks</h3>
//             { stacks &&
//               Object.entries(stacks.reduce((grouped, stack) => {
//                 (grouped[stack.type] = grouped[stack.type] || []).push(stack);
//                 return grouped;
//               }, {})).map(([type, stacks]) => (
//                 <div key={type} className="card-body p-0 ps-3 pt-2 mb-0 ms-3 mt-0">
//                   <h5 className='pt-2'>{capitalize(type)}</h5>
//                   <ul className="list-unstyled mb-0 pb-0">
//                     {stacks.map((stack, index) => (
//                       <li key={index} className='ms-3 mb-0'>
//                         <i className={getIconClass(type)}></i>
//                         <strong className='mb-0'>{capitalize(stack.name)}</strong>
//                       </li>
//                     ))}
//                   </ul>
//                 </div> 
//               ))
//             }
//             <div className='mt-3'></div>
//           </div>
//         </div>
//       </div>
//   );
// }

// export default CompaniesTable;