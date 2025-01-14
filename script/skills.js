export function skillFunctionality() {

  const skills = [
    {
      icon: 'images/icon/html.png',
      name: 'HTML',
      type: 'tech-stack',
      progress: 90
    },
    {
      icon: 'images/icon/CSS.png',
      name: 'CSS',
      type: 'tech-stack',
      progress: 60
    },
    {
      icon: 'images/icon/js (1).png',
      name: 'JAVASCRIPT',
      type: 'tech-stack',
      progress: 65
    },
    {
      icon: 'images/icon/java-1.png',
      name: 'JAVA',
      type: 'tech-stack',
      progress: 70
    },
    {
      icon: 'images/icon/python.png',
      name: 'PYTHON',
      type: 'tech-stack',
      progress: 40
    },
    {
      icon: 'images/icon/acode.png',
      name: 'A CODE',
      type: 'tool',
      progress: 90
    },
    {
      icon: 'images/icon/jvdroid.png',
      name: 'JVDROID',
      type: 'tool',
      progress: 70
    },
    {
      icon: 'images/icon/github (2).png',
      name: 'GITHUB',
      type: 'tool',
      progress: 85
    },
    {
      icon: 'images/icon/trebedit.png',
      name: 'TREBEDIT',
      type: 'tool',
      progress: 95
    }
  ];

  let techstacksHTML = '';
  let toolsHTML = '';

  skills.forEach(skill => {
    const skillType = skill.type;

    if (skillType === 'tech-stack') {
      techstacksHTML += `
        <div class="tech-stack skill">
          <img class="icon" src="${skill.icon}" alt="skill-icon">
          <p>${skill.name}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${skill.progress}%"></div>
          </div>
          <div class="percentage">${skill.progress}%</div>
        </div>
      `;
    }
    if (skillType === 'tool') {
      toolsHTML += `
        <div class="tool skill">
          <img class="icon" src="${skill.icon}" alt="skill-icon">
          <p>${skill.name}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${skill.progress}%"></div>
          </div>
          <div class="percentage">${skill.progress}%</div>
        </div>
      `;
    }
  });

  document.querySelector('.skills-container.tech-stack-skills').innerHTML = techstacksHTML;
  document.querySelector('.skills-container.tools-skills').innerHTML = toolsHTML;

  // Button functionality
  const techstackBtn = document.querySelector('.tech-stacks-btn');
  const toolsBtn = document.querySelector('.tools-btn');
  const techstackSkill = document.querySelector('.tech-stack-skills');
  const toolsSkill = document.querySelector('.tools-skills');

  techstackBtn.addEventListener('click', () => {
    toolsBtn.classList.remove('selected');
    techstackBtn.classList.add('selected');
    techstackSkill.style.display = 'grid';
    toolsSkill.style.display = 'none';
  });

  toolsBtn.addEventListener('click', () => {
    toolsBtn.classList.add('selected');
    techstackBtn.classList.remove('selected');
    techstackSkill.style.display = 'none';
    toolsSkill.style.display = 'grid';
  });
}