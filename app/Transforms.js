function groupByMonth (input, field, unixDate) {
  // This is silly, but the ArcGIS server SimpliCity uses
  // uses simple unix time, while the open data portal one
  // uses a date string. Just a hack for now - should be part of
  // the data source configuration setup (and probably should
  // be translated to common format as it's being processed in).
  let monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let counter = 0;
  let errCount = 0;
  if (input == null || input == undefined) return null;
  input.forEach( (r) => {
    let month = 0;
    ++counter;
    try {
      let d;
      if (unixDate) {
        d = new Date(r[field] + 0);
      }
      else {
        d = new Date(Date.parse(r[field])); // this is the date.
      }
      month = d.getMonth();
      let year = d.getFullYear();
      if (year < 2015 || year > 2016) {
        if (errCount < 100) console.log("The year is " + year);
        ++errCount;
      }
    }
    catch (err) {
      if (errCount < 20) console.log("Error in groupByMonth" + r[field]);
      ++errCount;
      month = 0; // We'll just let the month be 0 for now.
    }
    monthlyData[month] += 1;
  });
  return monthlyData;
}

function groupByStringField (input, field, maxCategories) {
  let data = [];
  let cmap = {}
  if (input == null || input == undefined) return null;
  input.forEach( (r) => {
    if (!(r[field] in cmap)) {
      cmap[r[field]] = 1;
    }
    else {
      cmap[r[field]] += 1;
    }
  });
  let list = [];
  for (let key in cmap) {
    list.push({key: key, value: cmap[key]});
  }
  list.sort( (a, b) => {
    return (a.value<b.value)?1:((a.value>b.value)?-1:0);
  });
  let shortList = list.slice(0,maxCategories);
  let otherTotal = 0;
  list.slice(maxCategories).forEach((item)=> {
    otherTotal += item.value;
  });
  if (otherTotal > 0) {
    shortList.push({key: "Other", value: otherTotal});
  }
  return shortList;
}

export function countByField (input, transform, unixDate = false) {
  let data = null;
  if (transform.field_type == "string") {
    data = groupByStringField (input,transform.field,transform.max_values);
  }
  else if (transform.field_type == "date") {
    if (transform.period == "month") {
      data = {
        labels: ["Jan","Feb","Mar", "Apr", "May", "Jun", "Jul",
                 "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: groupByMonth(input, transform.field, unixDate)
      }
    }
    else {
      console.log(`countByField: unknown period ${transform.period} for date field`);
    }
  }
  return data;
}
