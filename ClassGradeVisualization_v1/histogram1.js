
                let screen_h ={width:1300 , height:600};
                let chartMargin_h = {top:100,right:100,bottom:100,left:100};
                let colorScale_h = d3.scaleOrdinal(d3.schemeCategory20b);
            
        
                d3.json("data/classData.json",function(error,data)
                                  {
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        FD=finals(data);
                                        console.log(FD);
                                        let xScale = d3.scaleLinear()
                                                        .domain([0,FD.length*5])
                                                        .range([chartMargin_h.left,screen_h.width-chartMargin_h.right]);
                                        let yScale = d3.scaleLinear()
                                                        .domain([0,d3.max(FD)])
                                                        .range([ screen_h.height-chartMargin_h.bottom,chartMargin_h.top])
                                       createChart_h(FD,xScale,yScale);
                                    }
                                    });
                
                let createChart_h = function(data,xScale,yScale)
                {
                    let svg = d3.select("#histogram")
                            .append("svg")
                            .attr("height",screen_h.height)
                            .attr("width",screen_h.width);
                    let chart = svg.append("g");
                        
                    let xAxis = chart.append("g");
                    let yAxis = chart.append("g");


                    chart.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x", function(d,i)
                             {
                                return xScale(i*5);
                            })
                        .attr("y",function(d,i)
                             {
                              return yScale(d);
                              })
                        .attr("width",function(d,i)
                             {
                                return (xScale(5)-xScale(0));
                                })
                        .attr("height", function(d,i)
                             {
                                return screen_h.height-chartMargin_h.top-yScale(d);
                            })
                        .attr("id",function(d,i){
                                return i;
                            })
                        .attr("fill",function(d,i)
                        {
                            return colorScale_h(i);
                        });

                    
                    
                    xAxis.attr("class","axis")
                        .attr("transform", "translate(0,"+(screen_h.height-chartMargin_h.top)+")")
                        .call(d3.axisBottom().scale(xScale).ticks(20));
                
                    yAxis.attr("class","axis")
                        .attr("transform", "translate("+chartMargin_h.left+",0)")
                        .call(d3.axisLeft().scale(yScale).ticks(3));

                    

                }
                
                
                let finals = function(data)
                {
                    let score =0;
                    let collector = [];
                    for(let i=0;i<20;i++)
                        {
                            collector.push(0);
                        }
                    for(let j=1;j<data.length;j++)
                        {
                            score=0;
                            let k=0;
                            for(k=0;k<data[j].final.length;k++)
                                {
                                    score=score+data[j].final[k].grade/data[j].final[k].max*30/100/data[j].final.length;
                                }
                            for(k=0;k<data[j].homework.length;k++)
                                {
                                    score=score+data[j].homework[k].grade/data[j].homework[k].max*15/100/data[j].homework.length;
                                }
                            for(k=0;k<data[j].quizes.length;k++)
                                {
                                    score=score+data[j].quizes[k].grade/data[j].quizes[k].max*15/100/data[j].quizes.length;
                                }
                            for(k=0;k<data[j].test.length;k++)
                                {
                                    score=score+data[j].test[k].grade/data[j].test[k].max*40/100/data[j].test.length;
                                }
                            
                            score=score*100;
                            
                            
                            for(k=0;k<20;k++)
                                {
                                    if( score <= ((k+1)*5))
                                        {
                                            collector[k]++;
                                            break;
                                        }
                                }
                            
                        }
                    return collector;
                }
