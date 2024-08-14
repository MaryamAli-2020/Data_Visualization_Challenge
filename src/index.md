---
theme: [light, alt]
toc: false
---

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
    }

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .hero h1 {
      max-width: none;
      font-size: 14vw;
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero h2 {
      margin: 0;
      max-width: 34em;
      font-size: 20px;
      font-style: initial;
      font-weight: 500;
      line-height: 1.5;
      color: var(--theme-foreground-muted);
    }

    @media (min-width: 640px) {
      .hero h1 {
        font-size: 90px;
      }
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      justify-content: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px 0;
    }

    .card {
      background-color: #f7f9fc;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      margin: 10px;
    }

    .card h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .card .big {
      font-size: 32px;
      font-weight: 700;
      color: #000;
    }

    .grid-3 {
         display: grid;
         grid-template-columns: 1fr 2px 1fr;
         gap: 20px;
         align-items: start;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .plot-container-wrapper {
      width: 70%;
      margin: 0 auto; /* Center the div horizontally */
      margin-bottom: 15px;
    }

    .vertical-line-outer {
      width: 1px;
      height: 100%;
      margin: auto;
      position: relative;
      overflow: hidden;
    }

    .vertical-line-inner {
      position: absolute;
      width:100%;
      height: 60%;
      background: grey;
      top: 20%;
      box-shadow: 0px 0px 30px 20px grey;
    }



    #plot-container,
    #stacked-bar-container,
    #clustered-bar-container,
    #trend-container,
    #degree-popularity-container,
    #gender-nationality-pie-container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: 400px;
    }


</style>

<div class="hero">
  <h1>Graduates in Higher Education In Ajman</h1>
</div>

<!-- Load and transform the data -->

```js
const launches = FileAttachment("./data/data.json").json();
```

```js
//display(launches);
//display(Inputs.table(launches.results));
```

<!-- Cards with big numbers -->
```js
//male
const maleCount = launches.results.filter((d) => d.gender_en == "Male").length;
document.getElementById("male-count").textContent =
  maleCount.toLocaleString("en-US");

//female
const femaleCount = launches.results.filter(
  (d) => d.gender_en == "Female"
).length;
document.getElementById("female-count").textContent =
  femaleCount.toLocaleString("en-US");

//Local
const localCount = launches.results.filter(
  (d) => d.localflag_en == "Local"
).length;
document.getElementById("local-count").textContent =
  localCount.toLocaleString("en-US");

//Expat
const expatCount = launches.results.filter(
  (d) => d.localflag_en == "Expat"
).length;
document.getElementById("expat-count").textContent =
  expatCount.toLocaleString("en-US");
```

<!-- Cards Section -->
<div class="card-grid">
  <div class="card">
    <h2>Males ♂️</h2>
    <span class="big" id="male-count"></span>
  </div>
  <div class="card">
    <h2>Females ♀️</h2>
    <span class="big" id="female-count"></span>
  </div>
  <div class="card">
    <h2>Local <span style="font-size: smaller;">UAE</span></h2>
    <span class="big" id="local-count"></span>
  </div>
  <div class="card">
    <h2>Expat</h2>
    <span class="big" id="expat-count"></span>
  </div>
</div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"> //importing the library plotly</script>
<!-- Plots -->

```js
const data = launches.results;

//aggregate data by academic_year
function aggregateData(data) {
  const aggregated = {};
  data.forEach((entry) => {
    if (!aggregated[entry.academic_year]) {
      aggregated[entry.academic_year] = {
        bachelors: 0,
        certificate: 0,
        diploma: 0,
        doctorate: 0,
        graduate_certificate: 0,
        graduate_diploma: 0,
        higher_diploma: 0,
        masters: 0,
        other_khr: 0,
        total: 0,
      };
    }
    aggregated[entry.academic_year].bachelors += entry.bachelors;
    aggregated[entry.academic_year].certificate += entry.certificate;
    aggregated[entry.academic_year].diploma += entry.diploma;
    aggregated[entry.academic_year].doctorate += entry.doctorate;
    aggregated[entry.academic_year].graduate_certificate +=
      entry.graduate_certificate;
    aggregated[entry.academic_year].graduate_diploma += entry.graduate_diploma;
    aggregated[entry.academic_year].higher_diploma += entry.higher_diploma;
    aggregated[entry.academic_year].masters += entry.masters;
    aggregated[entry.academic_year].other_khr += entry.other_khr;
    aggregated[entry.academic_year].total += entry.total;
  });
  return aggregated;
}

const aggregatedData = aggregateData(data);

const years = Object.keys(aggregatedData);
const bachelors = years.map((year) => aggregatedData[year].bachelors);
const certificates = years.map((year) => aggregatedData[year].certificate);
const diplomas = years.map((year) => aggregatedData[year].diploma);
const doctorates = years.map((year) => aggregatedData[year].doctorate);
const graduateCertificates = years.map(
  (year) => aggregatedData[year].graduate_certificate
);
const graduateDiplomas = years.map(
  (year) => aggregatedData[year].graduate_diploma
);
const higherDiplomas = years.map((year) => aggregatedData[year].higher_diploma);
const masters = years.map((year) => aggregatedData[year].masters);
const others = years.map((year) => aggregatedData[year].other_khr);
const totals = years.map((year) => aggregatedData[year].total);

const plotData = [
  {
    x: years,
    y: bachelors,
    type: "scatter",
    mode: "lines+markers",
    name: "Bachelors",
  },
  {
    x: years,
    y: certificates,
    type: "scatter",
    mode: "lines+markers",
    name: "Certificates",
  },
  {
    x: years,
    y: diplomas,
    type: "scatter",
    mode: "lines+markers",
    name: "Diplomas",
  },
  {
    x: years,
    y: doctorates,
    type: "scatter",
    mode: "lines+markers",
    name: "Doctorates",
  },
  {
    x: years,
    y: graduateCertificates,
    type: "scatter",
    mode: "lines+markers",
    name: "Graduate Certificates",
  },
  {
    x: years,
    y: graduateDiplomas,
    type: "scatter",
    mode: "lines+markers",
    name: "Graduate Diplomas",
  },
  {
    x: years,
    y: higherDiplomas,
    type: "scatter",
    mode: "lines+markers",
    name: "Higher Diplomas",
  },
  {
    x: years,
    y: masters,
    type: "scatter",
    mode: "lines+markers",
    name: "Masters",
  },
  {
    x: years,
    y: others,
    type: "scatter",
    mode: "lines+markers",
    name: "Others",
  },
  {
    x: years,
    y: totals,
    type: "scatter",
    mode: "lines+markers",
    name: "Total",
  },
];

const layout = {
  title: "Degree over the Years",
  xaxis: { title: "Academic Year" },
  yaxis: { title: "Count" },
  plot_bgcolor: "rgba(0,0,0,0)",
  paper_bgcolor: "rgba(0,0,0,0)",
};

Plotly.newPlot("plot-container", plotData, layout);
```
<div class="plot-container-wrapper">
  <div id="plot-container"></div>
</div>
    <div class="insights">
        <ul>
            <li>Bachelor’s degrees consistently outpace other degree types, indicating a strong preference for this qualification among graduates.</li>
            <li>Fluctuations in graduate certificates and diplomas suggest varying educational trends or availability of these programs over the years.</li>
            <li>The gradual growth in doctorates and master’s degrees reflects increasing interest in advanced qualifications.</li>
            <li>Overall, the total number of graduates has risen, showing an expanding higher education sector in Ajman.</li>
            <li>Peaks in graduate numbers may correlate with changes in educational policies or institutional developments.</li>
        </ul>
    </div>

```js
// Prepare data for stacked bar chart
const degreeTypes = ['bachelors', 'certificate', 'diploma', 'doctorate', 'graduate_certificate', 'graduate_diploma', 'higher_diploma', 'masters', 'other_khr'];
const genderData = {
  Male: {},
  Female: {}
};

degreeTypes.forEach(type => {
  genderData.Male[type] = launches.results.filter(d => d.gender_en === "Male").reduce((sum, d) => sum + d[type], 0);
  genderData.Female[type] = launches.results.filter(d => d.gender_en === "Female").reduce((sum, d) => sum + d[type], 0);
});

const stackedBarData = degreeTypes.map(type => ({
  x: ['Male', 'Female'],
  y: [genderData.Male[type], genderData.Female[type]],
  name: type.charAt(0).toUpperCase() + type.slice(1),
  type: 'bar'
}));

const stackedBarLayout = {
  title: 'Distribution of Students by Degree Type and Gender',
  barmode: 'stack',
  xaxis: { title: 'Gender' },
  yaxis: { title: 'Number of Students' }
};

Plotly.newPlot('stacked-bar-container', stackedBarData, stackedBarLayout);
```


```js
// Prepare data for clustered bar chart
const localVsExpatData = degreeTypes.map(type => ({
  x: ['Local', 'Expat'],
  y: [
    launches.results.filter(d => d.localflag_en === "Local").reduce((sum, d) => sum + d[type], 0),
    launches.results.filter(d => d.localflag_en === "Expat").reduce((sum, d) => sum + d[type], 0)
  ],
  name: type.charAt(0).toUpperCase() + type.slice(1),
  type: 'bar'
}));

const clusteredBarLayout = {
  title: 'Comparison of Local vs. Expatriate Student Enrollment',
  barmode: 'group',
  xaxis: { title: 'Nationality' },
  yaxis: { title: 'Number of Students' }
};

Plotly.newPlot('clustered-bar-container', localVsExpatData, clusteredBarLayout);
```
<div class="grid">
  <div id="clustered-bar-container"></div>
  <div id="stacked-bar-container"></div>
</div>

<div class="grid">
    <div class="insights">
        <ul>
            <li>A nearly equal distribution between male and female graduates suggests balanced gender representation in higher education.</li>
            <li>Significant differences in gender distribution may highlight trends in specific programs or fields.</li>
            <li>Comparing gender ratios over the years could reveal shifts in representation due to educational policies or societal changes.</li>
        </ul>
    </div>
    <div class="insights">
        <ul>
            <li>The trend of each degree type over time highlights the popularity and shifts in academic preferences among graduates.</li>
            <li>Increases or decreases in specific degrees can provide insight into changing career paths or emerging fields of study.</li>
        </ul>
    </div>
</div>

```js
// Aggregate data for trend analysis
function aggregateByYearAndCategory(data, category) {
  const aggregated = {};
  data.forEach(entry => {
    if (!aggregated[entry.academic_year]) {
      aggregated[entry.academic_year] = { Local: 0, Expat: 0 };
    }
    aggregated[entry.academic_year][entry.localflag_en] += entry[category];
  });
  return aggregated;
}

const bachelorsTrend = aggregateByYearAndCategory(launches.results, 'bachelors');

const localBachelors = years.map(year => bachelorsTrend[year].Local);
const expatBachelors = years.map(year => bachelorsTrend[year].Expat);

const trendData = [
  {
    x: years,
    y: localBachelors,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Local Bachelors'
  },
  {
    x: years,
    y: expatBachelors,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Expat Bachelors'
  }
];

const trendLayout = {
  title: 'Trend Analysis of Bachelors Over Academic Years',
  xaxis: { title: 'Academic Year' },
  yaxis: { title: 'Number of Students' }
};

Plotly.newPlot('trend-container', trendData, trendLayout);
```
<div class="plot-container-wrapper">
  <div id="trend-container"></div>
</div>
    <div class="insights">
        <ul>
            <li>Local bachelor's degree trends might show steady growth, reflecting a strong interest among local students.</li>
            <li>Expat trends in bachelor's degrees could indicate varying levels of interest based on changing immigration policies or educational opportunities.</li>
        </ul>
    </div>

```js
// Similar to Trend Analysis, but for all degree types
const allDegreeTrends = degreeTypes.map(type => {
  const trend = aggregateByYearAndCategory(launches.results, type);
  return {
    x: years,
    y: years.map(year => trend[year].Local + trend[year].Expat),
    type: 'scatter',
    mode: 'lines+markers',
    name: type.charAt(0).toUpperCase() + type.slice(1)
  };
});

const degreePopularityLayout = {
  title: 'Degree Popularity Over Time',
  xaxis: { title: 'Academic Year' },
  yaxis: { title: 'Number of Students' }
};

Plotly.newPlot('degree-popularity-container', allDegreeTrends, degreePopularityLayout);
```
<div class="plot-container-wrapper">
  <div id="degree-popularity-container"></div>
</div>
    <div class="insights">
        <ul>
            <li>The trend of each degree type over time highlights the popularity and shifts in academic preferences among graduates.</li>
            <li>Increases or decreases in specific degrees can provide insight into changing career paths or emerging fields of study.</li>
        </ul>
    </div>

```js

// Prepare data for pie chart
const institutionTypes = [...new Set(launches.results.map(d => d.institution_type_en))];

const genderNationalityData = institutionTypes.map(type => {
  const localMale = launches.results.filter(d => d.institution_type_en === type && d.localflag_en === "Local" && d.gender_en === "Male").reduce((sum, d) => sum + d.total, 0);
  const localFemale = launches.results.filter(d => d.institution_type_en === type && d.localflag_en === "Local" && d.gender_en === "Female").reduce((sum, d) => sum + d.total, 0);
  const expatMale = launches.results.filter(d => d.institution_type_en === type && d.localflag_en === "Expat" && d.gender_en === "Male").reduce((sum, d) => sum + d.total, 0);
  const expatFemale = launches.results.filter(d => d.institution_type_en === type && d.localflag_en === "Expat" && d.gender_en === "Female").reduce((sum, d) => sum + d.total, 0);

  return {
    type: 'pie',
    labels: ['Local Male', 'Local Female', 'Expat Male', 'Expat Female'],
    values: [localMale, localFemale, expatMale, expatFemale],
    name: type,
    domain: { column: institutionTypes.indexOf(type) },
    hoverinfo: 'label+percent',
    textinfo: 'value',
  };
});

const pieLayout = {
  title: 'Gender and Nationality Breakdown by Institution Type',
  grid: { rows: 1, columns: institutionTypes.length },
  annotations: institutionTypes.map((type, index) => ({
    font: { size: 14 },
    showarrow: false,
    text: type,
    x: (index + 0.5) / institutionTypes.length,
    y: -0.1
  }))
};

Plotly.newPlot('gender-nationality-pie-container', genderNationalityData, pieLayout);
```
<div class="grid-3">
  <div id="gender-nationality-pie-container"></div>
      <div class="vertical-line-outer"> <div class="vertical-line-inner"></div></div>
<div class="insights">
        <ul>
            <li>The pie charts provide a detailed view of the distribution of gender and nationality across different types of institutions.</li>
            <li>Private institutions show a higher proportion of expatriate males, reflecting their preference for flexible and diverse educational options.</li>
            <li>Local females tend to prefer government institutions, which may offer programs better aligned with cultural values and community needs.</li>
            <li>Comparing these distributions can reveal important trends in educational choices based on gender and nationality, guiding future educational policies and outreach efforts.</li>
        </ul>
    </div>
</div>

