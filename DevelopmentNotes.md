## Installation

````
  npm install
  npm start
````
Then navigate in browser to http://localhost:3000

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


## Future Considerations

* Break out and publish the individual visualization components and the dashboard component as NPM modules.

* I made the datasets an array so that more sophisticated visualizations and analyses involving multiple datasets can be done.

* Obviously the dashboard component needs to be more configurable.
