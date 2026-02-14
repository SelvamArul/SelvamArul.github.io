// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "publications in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Robotic competitions I participated as a part of Team NimbRo",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "dropdown-projects",
              title: "projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/projects/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-rust-vs-go-error-handling",
        
          title: "Rust vs. Go error handling",
        
        description: "Rust vs. Go error handling",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/Rust-Error/";
          
        },
      },{id: "news-starting-a-new-position-at-siemens-ag-as-a-postdoctoral-researcher-in-edge-computing",
          title: 'Starting a new position at Siemens AG as a postdoctoral researcher in Edge...',
          description: "",
          section: "News",},{id: "news-successfully-defended-my-ph-d-thesis-at-the-institute-for-computer-science-faculty-of-mathematics-and-natural-sciences-university-of-bonn",
          title: 'Successfully defended my Ph.D. thesis at the Institute for Computer Science, Faculty of...',
          description: "",
          section: "News",},{id: "news-starting-a-new-position-at-siemens-ag-as-a-research-scientist-in-edge-computing",
          title: 'Starting a new position at Siemens AG as a research scientist in Edge...',
          description: "",
          section: "News",},{id: "projects-amazon-robotics-challenge",
          title: 'Amazon Robotics Challenge',
          description: "Team NimbRo Picking @ Amazon Robotics Challenge",
          section: "Projects",handler: () => {
              window.location.href = "/projects/arc/";
            },},{id: "projects-confidential-edge-computing",
          title: 'Confidential Edge Computing',
          description: "Enabling confidential computing for open edge platforms",
          section: "Projects",handler: () => {
              window.location.href = "/projects/coco/";
            },},{id: "projects-mobile-robotics-amp-uavs",
          title: 'Mobile Robotics &amp;amp; UAVs',
          description: "Team NimbRo @ MBZIRC",
          section: "Projects",handler: () => {
              window.location.href = "/projects/mbzirc/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Resume.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%64%6F%6B%74%6F%72%61%6E%64%61%72%75%6C@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=_6l7MQgAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
