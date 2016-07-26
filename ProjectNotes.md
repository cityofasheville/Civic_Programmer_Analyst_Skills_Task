# Project Notes

## The Problem

I have approached the problem as one of creating a kind of _dataset discovery
tool_, something that would:

* Allow a user who stumbles onto the dataset through SimpliCity to quickly understand
what it's about and whether they're interested,
* Allow a developer or research to quickly get up to speed on what information
the dataset contains and how different fields are related to one another.

In a way, I've written the tool that I wish I'd had when I was starting this project and would want to have before trying to build an application that uses the data.

## Approach

Briefly, the dashboard attempts to answer a couple simple questions:

* What is this dataset about?
* What fields are available and how are different fields related to one another?

The first question is obviously best addressed with a meaningful name and description - nothing original there. The tool helps answer the second question through a combination of individual field documentation and the ability to explore a sample dataset (here permit records active within the past year).

The dashboard provides a few features to help with the exploration:

1. Drill-down on individual fields to view typical values,
2. Simple visualizations that convey information about key fields, e.g., a pie chart of most-frequently used values in a category field or a bar chart showing activity over time,
3. Page-level filters that can be used to narrow the results in the previous features.

The tool uses a [configuration file](./app/dashboard_config.js) to drive the construction of a dashboard. Specifically, the configuration file defines:

* Dashboard titles, description & link to open data portal,
* API information to access the sample data,
* Filter button-sets and the fields they act on,
* Attribute documentation,including whether typical values can be viewed,
* Visualizations to show in the Quickview section and the data transforms that feed them.

The data loader is able to handle paged data. All functionality on the dashboard starts working as soon as the first chunk of data arrives.

One benefit of the configuration-driven approach is that a dashboard developer can actually use the tool to explore and understand the dataset in order to build a better dashboard for it.

## Future

There are a few obvious enhancements to be made.

* Offer a bigger set of data transformations and visualizations for use in the Quickview section,
* Create data loaders for a few different APIs and make sure that all relevant API parameters are configurable,
* Create "typical value" displays for most field types (e.g., min/max/median/mean for numerical, date range, maybe even word clouds for text fields),
* Support the use of markdown in descriptions, etc.
* Allow a configuration file to be passed in as a string or read from a file (for now, I'm just importing it as code).
* ...

## Technical Details

### Installation
For a development version, simply clone the repo and run:

````
npm install
npm start
````
Then navigate in browser to http://localhost:3000. This uses the Webpack development server with hot reloading. To create a hostable site, just run the `webpack` command - output is in the `dist` directory. For this task I just manually uploaded the `dist` directory contents to a server. I've not yet created a production webpack configuration file so the live dashboard site is just running the development version.

### Framework
I've built this using React and Redux, mostly in ES2015 with a smattering of ES7 (yay Babel!).

In fact, given the simplicity of the app, Redux is not really necessary - it would have been quite sufficient to keep things in local state in the Dashboard component. However, it may be valuable if we build on this, especially if we have multi-page dashboards. In addition, I find it helpful in isolating the asynchronous API calls.
