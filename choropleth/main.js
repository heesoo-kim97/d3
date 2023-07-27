let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData


let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
 
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher'];
                if(percentage <= 15){
                    return 'tomato'
                }else if(percentage <= 30){
                    return 'orange'
                }else if(percentage <= 45){
                    return 'lightgreen'
                }else{
                    return 'darkgreen'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                // console.log(countyDataItem);
                return countyDataItem['id'];
            })
            .attr('data-education', (countyDataItem) => {
                // console.log(countyDataItem);
                let id = countyDataItem['id'];
                // console.log(id);
                let county = educationData.find((item) => {
                     //console.log(item);
                    return item['fips'] === id
                })
               
                let percentage = county['bachelorsOrHigher'];
                return percentage;
            })
            .on('mouseover', (e, countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'visible')
                console.log('after mouseover event:', countyDataItem);
                let id = countyDataItem['id'];
                let county = educationData.find((item) => {
                    return item['fips'] === id;
                })
                console.log('mouseover');
                console.log(county);
                console.log(id);
                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

                tooltip.attr('data-education', id /*county['bachelorsOrHigher'] */)
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            // console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        // console.log(educationData);
                        // console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)
