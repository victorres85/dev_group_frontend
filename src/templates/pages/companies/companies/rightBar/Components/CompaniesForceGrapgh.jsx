import { useState, useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 4 * r) r = w / 4;
  if (h < 4 * r) r = h / 4;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  console.log()

  return this;
}


const CompaniesForceGrapg = ({companies, setIsLoading, displayCompany}) => {
  console.log('Companies')
  const fgRef = useRef();

  const [graphData, setGraphData] = useState(null)
  const [images, setImages] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);


  useEffect(() => {
    if (companies){
    const gData = {
      nodes: companies.map(company => ({ id: company.name, logo: company.logo })),
      links: companies.filter(company => company.name !== 'labelium').map(company => ({ source: 'labelium', target: company.name }))
    };
    setGraphData(gData)
    setIsLoading(false)
  }
  }, [companies]);

  useEffect(() => {
    const imgs = {};
    const waitForNodes = (async()=>{
      while (graphData?.nodes === null){
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    })
    waitForNodes().then(() => {
    graphData?.nodes.forEach(node => {
      const img = new Image();
      img.src = node.logo;
      img.onload = () => {
        imgs[node.id] = img;
        setImages(imgs);
      };
    });
  });
  }, [graphData]);
  

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.zoom(5); // adjust the zoom level as needed
    }
  }, [graphData]);

  return (
            <div className="card-body d-flex justify-content-center align-items-center" style={{height:550}}>
              {graphData && 
              <ForceGraph2D 
              ref={fgRef}
              graphData={graphData}
              nodeAutoColorBy="id"
              linkColor={()=> 'grey'}
              linkWidth={()=> 2}
              linkCurvature={()=> false}
              nodeCanvasObject={(node, ctx) => {
                if (images[node.id]) {
                  ctx.drawImage(images[node.id], node.x - 8, node.y - 8, 16, 16);
                }
                if (node === hoveredNode) {
                  // Measure text
                  const textWidth = ctx.measureText(node.id).width;
                  ctx.beginPath();
                  ctx.fillStyle = 'white';
                  ctx.roundRect(node.x - ctx.measureText(node.id).width / 2 - 3, node.y + 10, textWidth+6, 6, 20);
                  ctx.fill();
                  // Draw text
                  ctx.beginPath();
                  ctx.fillStyle = 'black';
                  ctx.font = '4px Arial';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'hanging';
                  ctx.fillText(node.id, node.x, node.y + 10 + 6 / 4);
                }
              }}
              nodeVal={2} 
              onNodeHover={node => {
                document.body.style.cursor = node ? 'pointer' : null;
                if (node){
                  let cp = companies.find(c => c?.name === node.id);
                  displayCompany(cp)
                }
                try{
                  setHoveredNode(node);
                  setTimeout(()=>{
                    setHoveredNode(node);
                  },100)
                }
                catch{
                  setHoveredNode(null);
                }
              }}
              onNodeClick={node =>{
                if (node){
                  let cp = companies.find(c => c?.name === node.id);
                  window.open('/companies/'+cp.uid);
                }
              }}
              style={{ width: '100%', height: '100%' }}
            />
            }
            </div>
  );
}

export default CompaniesForceGrapg;