  let screen_s ={width:1250 , height:600};
            let chartMargin_s = {top:50,right:200,bottom:100,left:50};
            let colorScale_s = d3.scaleOrdinal(d3.schemeCategory20);
            let side_s = 45;
            
            
            
            d3.json("data/classData.json",function(error,data)
                                  {
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        
                                        let QD = quizData(data);
                                        let HD = homeworkData(data);
                                        let xScale = d3.scaleLinear()
                                                        .domain([0, d3.max(QD,function(d)
                                                                {
                                                                    let maxValue =0;
                                                                    for(let i=0;i<d.length;i++)
                                                                        {
                                                                            if(d[i].day>maxValue)
                                                                                {
                                                                                    maxValue=d[i].day;
                                                                                }
                                                                        }
                                                                    return maxValue;
                                                                })])
                                                        .range([chartMargin_s.left,screen_s.width-chartMargin_s.right]);
                                        let yScale = d3.scaleLinear()
                                                        .domain([0,d3.max(QD,function(d)
                                                                {
                                                                    return d[0].max;
                                                                })])
                                                        .range([screen_s.height-chartMargin_s.top,chartMargin_s.bottom]);
                                                                
                                        createChart_s(data,xScale,yScale);
                                    }
                                });
            
            let homeworkData = function(data)
            {
                let collector = [];
                
                for(let i=0;i<data.length;i++)
                    {
                        collector.push(data[i].homework);
                    }
                
                return collector;
            }
            
            let quizData = function(data)
            {
                let collector = [];
                
                for(let i=0;i<data.length;i++)
                    {
                        collector.push(data[i].quizes);
                    }
                
                return collector;
            }
            
            let draw_s = function(students,data,chart,index,xScale,yScale)
            {
                
                
                students.attr("fill",colorScale_s(index))
                        .selectAll("circle")
                        .data(data)
                        .transition()
                        .duration(1000)
                        .attr("cx", function(d)
                            {
                                
                                return xScale(d.day);
                            })
                        .attr("cy",function(d)
                            {
                                return yScale(d.grade);
                            })
                        .attr("r",6);
            }
            
            let createChart_s = function(data,xScale,yScale)
            {
                let svg = d3.select("#scatter1")
                            .append("svg")
                            .attr("height",screen_s.height)
                            .attr("width",screen_s.width);
                let chart = svg.append("g");
                let legend = svg.append("g");
                                
                let students = chart.append("g")
                                    .attr("fill",colorScale_s(0));

                let xAxis = chart.append("g");
                let yAxis = chart.append("g");
                
                
                
                
                
                students.selectAll("circle")
                    .data(data[0].quizes)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d)
                         {
                            return xScale(d.day);
                        })
                    .attr("cy",function(d)
                         {
                            return yScale(d.grade);
                        })
                    .attr("r",6);
                
                
                students.selectAll("circle")
                    .on("mouseover", function(){
                        d3.select(this)
                            .transition().duration(350)
                            .attr("opacity", 0.5); })
                    .on("mouseout", function(d){
                        d3.select(this)
                            .transition().duration(350)
                            .attr("opacity", 1); });
                
                

                
                xAxis.attr("class","axis")
                        .attr("transform", "translate(0,"+(screen_s.height-chartMargin_s.top)+")")
                        .call(d3.axisBottom().scale(xScale));
                
                yAxis.attr("class","axis")
                        .attr("transform", "translate("+chartMargin_s.left+",0)")
                        .call(d3.axisLeft().scale(yScale));
                
                
                legend.attr("transform","translate(1120,12)")
                        .selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x",function(d,i)
                             {  
                                if(i==11)
                                    {
                                        return side_s/2+"";
                                    }
                                
                                if(i>11)
                                    {
                                        return side_s+"";
                                    }
                                else{
                                        return "0";
                                    }
                            })
                        .attr("y",function(d,i)
                             {
                                if(i>11)
                                {
                                    return (i-12)*side_s+"";
                                }
                                else
                                {
                                    return (side_s*i)+"";
                                }
                                })
                        .attr("height",side_s+"")
                        .attr("width",side_s+"")
                        .attr("fill",function(d,i)
                             {
                                return colorScale_s(i);    
                            });
                        
                
                legend.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .attr("xlink:href",function(d,i)
                             {
                                return d.picture;
                            })
                        .attr("x",function(d,i)
                             {  
                                if(i==11)
                                    {
                                        return side_s/2+2.5+"";
                                    }
                                
                                if(i>11)
                                    {
                                        return side_s+2.5+"";
                                    }
                                else{
                                        return "2.5";
                                    }
                            })
                        .attr("y",function(d,i)
                             {
                                if(i>11)
                                {
                                    return (i-12)*side_s+2.5+"";
                                }
                                else
                                {
                                    return (side_s*i)+2.5+"";
                                }
                                })
                        .attr("height",40+"")
                        .attr("width",40+"")
                        .on("click",function(d,i)
                           {
                                draw_s(students,d.quizes,chart,i,xScale,yScale);
                            })
                        .on("mouseover",function(d,i)
                           {
                                d3.select(this).attr("height","45");
                                d3.select(this).attr("width","45");
                                if(i>11)
                                {
                                    d3.select(this).attr("x",side_s+"");
                                    d3.select(this).attr("y",(i-12)*side_s+"");
                                }
                                else
                                {
                                    if(i==11)
                                    {
                                        d3.select(this).attr("x",side_s/2+"");
                                        d3.select(this).attr("y",(side_s*i)+"");
                                    }
                                    else
                                    {
                                        d3.select(this).attr("x","0");
                                        d3.select(this).attr("y",(side_s*i)+"");
                                    }
                                }
                                
                            })
                        .on("mouseout",function(d,i)
                           {
                                d3.select(this).attr("height","40");
                                d3.select(this).attr("width","40");
                                if(i>11)
                                {
                                    d3.select(this).attr("x",side_s+2.5+"");
                                    d3.select(this).attr("y",(i-12)*side_s+2.5+"");
                                }
                                else
                                {
                                    if(i==11)
                                    {
                                        d3.select(this).attr("x",side_s/2+2.5+"");
                                        d3.select(this).attr("y",(side_s*i)+2.5+"");
                                    }
                                    else
                                    {
                                        d3.select(this).attr("x","2.5");
                                        d3.select(this).attr("y",(side_s*i)+2.5+"");
                                    }
                                }
                            });
            
                
                svg.append("text")
                    .text("Grade")
                    .attr("x","20")
                    .attr("y","70")
                    .attr("fill","white")
                    .style("font-size",20);
                svg.append("text")
                    .text("Day")
                    .attr("x","580")
                    .attr("y","590")
                    .attr("fill","white")
                    .style("font-size",20);
       



                
            }