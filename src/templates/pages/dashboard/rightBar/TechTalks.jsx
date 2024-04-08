
export default function TechTalks() {
    const talks = [
        {'name':"Tech & Tools", 'code': 'tech_tools', 'icon': 'fa fa-cogs', 'main_topics': [{'name': 'python', 'strenght': 3},
        {'name': 'react', 'strenght': 1},
        {'name': 'php', 'strenght': 3},
        {'name': 'aws', 'strenght': 4},
        {'name': 'docker', 'strenght': 4},
        {'name': 'kubernetes', 'strenght': 4},
        {'name': 'git', 'strenght': 2},
        {'name': 'ansible', 'strenght': 1},
        {'name': 'terraform', 'strenght': 2},
        {'name': 'linux', 'strenght': 2}]}, 
        {'name':"Security & Compliance", 'code': 'security_compliance', 'icon': 'fa fa-shield', 'main_topics': [{'name': 'cryptography', 'strenght': 1},
        {'name': 'compliance', 'strenght': 2},
        {'name': 'security', 'strenght': 3},
        {'name': 'privacy', 'strenght': 1},
        {'name': 'gdpr', 'strenght': 1},
        {'name': 'pci', 'strenght': 6},
        {'name': 'hipaa', 'strenght': 2},
        {'name': 'nist', 'strenght': 6},
        {'name': 'iso27001', 'strenght': 4},
        {'name': 'soc2', 'strenght': 2}]},
        {'name':"Ideation & Innovation", 'code': 'ideation_innovation', 'icon': 'fa fa-lightbulb', 'main_topics': [{'name': 'ideation', 'strenght': 4},
        {'name': 'innovation', 'strenght': 6},
        {'name': 'design_thinking', 'strenght': 2},
        {'name': 'lean_startup', 'strenght': 2},
        {'name': 'agile', 'strenght': 4},
        {'name': 'scrum', 'strenght': 2},
        {'name': 'kanban', 'strenght': 2},
        {'name': 'waterfall', 'strenght': 4},
        {'name': 'six_sigma', 'strenght': 2},
        {'name': 'pmp', 'strenght': 5}]}, 
        {'name':"AI Talk", 'code': 'ai_talk', 'icon': 'fa fa-robot', 'main_topics': [{'name': 'machine_learning', 'strenght': 3},
        {'name': 'deep_learning', 'strenght': 2},
        {'name': 'nlp', 'strenght': 6},
        {'name': 'computer_vision', 'strenght': 1},
        {'name': 'reinforcement_learning', 'strenght': 2},
        {'name': 'tensorflow', 'strenght': 6},
        {'name': 'pytorch', 'strenght': 5},
        {'name': 'keras', 'strenght': 4},
        {'name': 'scikit_learn', 'strenght': 6},
        {'name': 'pandas', 'strenght': 5}]},
      ]

    return (
      <>
        {talks.map((talk, index) => (
          <div key={index} className="card mb-3">
            <div className="card-header d-flex flex-row justify-content-between align-items-center">
              <h5 className="mb-0">{talk.name}</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled ms-4">
                {talk.main_topics.map((topic, index) => (
                  <li key={index} className='d-flex flex-row justify-content-start align-items-center mb-2'>
                    <i className={talk.icon}></i>
                    <strong>{topic.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </>
    );
  }

