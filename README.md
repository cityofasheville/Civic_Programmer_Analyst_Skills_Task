#Civic Programmer Analyst Skills Task

> A skills assessment for a Civic Programmer Analyst position

##The Problem


At the City of Asheville, we provide citizens and city employees with access to data in several ways. The majority of data provided by the city can be accessed through one of the following web applications: [SimpliCity](http://simplicity.ashevillenc.gov/), [mapAsheville](http://arcgis.ashevillenc.gov/mapAsheville/), and our [Open Data Portal](http://data.ashevillenc.gov/). One of our goals is to increase the level of integration between these three web applications in an effort to provide a more rich, seamless, and engaging experience for users. To this end, one of the most significant deficiencies in the city’s data offerings is a lack of summary statistics (or dashboards) for the datasets we provide. We’ve had an increasing number of requests from our internal customers (city employees) for dashboards on various datasets used by the city, and we think that a similar need exists in the citizen community as well.  Currently, SimpliCity does a pretty good job of providing some localized summary statistics for specific locations in the city; however, it doesn’t currently have a way to provided citywide data summaries or dashboards to our users. In the near future, we plan to update the code base for SimpliCity, and as part of the update, we would like to add some new features to SimpliCity, one of which being summary dashboards for each dataset. 


 
##The Task
If you are hired for this position, part of your job would be architecting and developing future implementations of SimpliCity and other web applications at the city. We’d like you to complete a small task so that we can learn about how you approach problems, and hopefully get to know you better in the process


Your task is to create a prototype dashboard for the City of Asheville’s permitting data. We’re not looking for you to reinvent the wheel, so feel free to use or borrow other code, and the dashboard does not need to integrate with SimpliCity. We’re looking for a small standalone application for this task to potentially become part of SimpliCity in the future.


The dashboard to should do the the following: 


1. Provide summary statistics that tell a meaningful story about the data
2. Provide information about the dataset that lets the user know, at a glance, what the dataset is and what type of information could be discovered from the dataset
3. Always be up to date using latest permitting data provided through our Open Data Portal (see Resources below)
4. Responsive both in design and in the amount of time it takes to load.
5. Use a framework like Angular1, Angular2, React/Redux (if you use something else, please let us know why)
6. Use a visualization library like D3.js or chart.js
7. Be designed with an eye toward reusability and configurability (We don’t want to code a separate dashboard for each dataset. Ideally, we would have one dashboard that could be passed a separate configuration for each dataset. Don’t worry about this too much on the prototype, but if you see opportunities for abstraction, please take them.)


##Rules 


Keep it simple. We are not looking for a finished product but want to learn about your skills and how you approach problems. Think of your delivery as something “minimal” that is on the road to awesome.


* You may use or borrow anything you want but the work should be done by you.
* You may email us with any questions. ccarlyle@ashevillenc.gov or use this repo’s issues (preferred).

##Deliverables
1. A link to the GitHub repository where you did your development, or a pull-request if you choose to fork this repo
2. A link to the live dashboard (using GitHub pages is preferred, but we really don’t care where you’re serving it from.)
3. A brief write up describing your approach (ideally, this would just be a markdown file in your repo)


##Resources


* [City of Asheville’s Open Data Portal Permit Data](http://data.ashevillenc.gov/datasets/0b8ff99cce324fb58c81d5433ae883cf_0) : The data can be interacted with as GeoJSON, through the [ArcGIS REST API](http://arcgis.ashevillenc.gov/arcgis/rest/services/Permits/AshevillePermits/MapServer/0), or by downloading as a spreadsheet.

(This dataset is updated nightly from the City's permitting software database)
