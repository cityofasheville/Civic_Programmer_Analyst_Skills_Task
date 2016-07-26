# Project Notes

## The Problem

Dataset discovery page.  Solve own problem.

## Approach


## Installation

````
npm install
npm start
````
Then navigate in browser to http://localhost:3000.

For now I'm just manually publishing to the Github pages site by running _webpack_ and then moving the files from the _dist_ directory into the main directory in a _gh-pages_ branch (you'll also need to change index.html to load _/Civic_Programmer_Analyst_Skills_Task/avl-dashboard-main.js_ rather than _/avl-dashboard-main.js_). However, for a real production version, I'd have a production webpack configuration and publish it to an NPM server.

In various files I've included comments of the form:
````
  /******* Project Commentary *********
    Some commentary about the project here
  */
````
The purpose of these sections is usually to point out things that are just stubbed out, but
that provide extension points for development of a production tool.

## Framework
I've built this using React and Redux. In fact, given the simplicity of the app, Redux is not really necessary - it would have been quite sufficient to keep things in local state in the Dashboard component. However, it may be valuable if we build on this, especially if we have multi-page dashboards. In addition, I find it helpful in isolating the asynchronous API calls.

webpack + ES2015 (and a smattering of ES7, thanks to the magic of Babel)


## Future Considerations

* Break out and publish the individual visualization components and the dashboard component as NPM modules.

* I made the datasets an array so that more sophisticated visualizations and analyses involving multiple datasets can be done.

* Obviously the dashboard component needs to be more configurable.
