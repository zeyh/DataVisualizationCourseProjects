 let screen ={width:1240 , height:580};
            let chartMargin = {top:50,right:200,bottom:100,left:100};
            let colorScale = d3.scaleOrdinal(d3.schemeCategory20);
            let side = 45;
            d3.json("data/classData.json",function(error,data)
                                  {
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        let ND = newData(data);
                                        console.log(ND);
                                        let xScale = d3.scaleLinear()
                                                        .domain([0, d3.max(ND,function(d)
                                                                {
                                                                    return d.grades.length;
                                                                })])
                                                        .range([chartMargin.left,screen.width-chartMargin.right]);
                                        let yScale = d3.scaleLinear()
                                                        .domain([0, 100])
                                                        .range([screen.height-chartMargin.top,chartMargin.bottom]);
                                        
                                        createChart(ND,xScale,yScale);
                                    }
                                    });
            
            let createChart = function(data,xScale,yScale)
            {
                let svg = d3.select("#line")
                            .append("svg")
                            .attr("height",screen.height)
                            .attr("width",screen.width);
                let chart = svg.append("g");
                let legend = svg.append("g");
                                
                let students = chart.append("g");

                let xAxis = chart.append("g");
                let yAxis = chart.append("g");
                let line = d3.line()
                                .x(function(d,i)
                                  {
                                    return xScale(i+1);
                                })
                                .y(function(d,i)
                                  {
                                    return yScale(d.grade/d.max*100);
                                })
                
                
                
                
                
                students.append("path")
                    .datum(data[1].grades)
                    .attr("class","line")
                    .attr("d",line)
                    .style("stroke",colorScale(0))
                    .style("stroke-width",3)
                    .style("fill","none");
                

                
                xAxis.attr("class","axis")
                        .attr("transform", "translate(0,"+(screen.height-chartMargin.top)+")")
                        .call(d3.axisBottom().scale(xScale));
                
                yAxis.attr("class","axis")
                        .attr("transform", "translate("+chartMargin.left+",0)")
                        .call(d3.axisLeft().scale(yScale));
                
                
                legend.attr("transform","translate(1090,42)")
                        .selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x",function(d,i)
                             {  
                                if(i==11)
                                    {
                                        return side/2+"";
                                    }
                                
                                if(i>11)
                                    {
                                        return side+"";
                                    }
                                else{
                                        return "0";
                                    }
                            })
                        .attr("y",function(d,i)
                             {
                                if(i>11)
                                {
                                    return (i-12)*side+"";
                                }
                                else
                                {
                                    return (side*i)+"";
                                }
                                })
                        .attr("height",side+"")
                        .attr("width",side+"")
                        .attr("fill",function(d,i)
                             {
                                return colorScale(i);    
                            });
                        
                
                legend.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .attr("xlink:href",function(d,i)
                             {
                                return d.pic;
                            })
                        .attr("x",function(d,i)
                             {  
                                if(i==11)
                                    {
                                        return side/2+2.5+"";
                                    }
                                
                                if(i>11)
                                    {
                                        return side+2.5+"";
                                    }
                                else{
                                        return "2.5";
                                    }
                            })
                        .attr("y",function(d,i)
                             {
                                if(i>11)
                                {
                                    return (i-12)*side+2.5+"";
                                }
                                else
                                {
                                    return (side*i)+2.5+"";
                                }
                                })
                        .attr("height",40+"")
                        .attr("width",40+"")
                        .on("click",function(d,i)
                           {
                                draw(students,data,line,i,xScale,yScale);
                            })
                        .on("mouseover",function(d,i)
                           {
                                d3.select(this).attr("height","45").style("cursor", "pointer");
                                d3.select(this).attr("width","45");
                                if(i>11)
                                {
                                    d3.select(this).attr("x",side+"");
                                    d3.select(this).attr("y",(i-12)*side+"");
                                }
                                else
                                {
                                    if(i==11)
                                    {
                                        d3.select(this).attr("x",side/2+"");
                                        d3.select(this).attr("y",(side*i)+"");
                                    }
                                    else
                                    {
                                        d3.select(this).attr("x","0");
                                        d3.select(this).attr("y",(side*i)+"");
                                    }
                                }
                                
                            })
                        .on("mouseout",function(d,i)
                           {
                                d3.select(this).attr("height","40").style("cursor", none);
                                d3.select(this).attr("width","40");
                                if(i>11)
                                {
                                    d3.select(this).attr("x",side+2.5+"");
                                    d3.select(this).attr("y",(i-12)*side+2.5+"");
                                }
                                else
                                {
                                    if(i==11)
                                    {
                                        d3.select(this).attr("x",side/2+2.5+"");
                                        d3.select(this).attr("y",(side*i)+2.5+"");
                                    }
                                    else
                                    {
                                        d3.select(this).attr("x","2.5");
                                        d3.select(this).attr("y",(side*i)+2.5+"");
                                    }
                                }
                            });
            
                
                svg.append("text")
                    .text("Grade")
                    .attr("x","54")
                    .attr("y","70")
                    .attr("fill","white")
                    .style("font-size",20)
                    ;
                svg.append("text")
                    .text("Day")
                    .attr("x","580")
                    .attr("y","570")
                    .attr("fill","white")
                    .style("font-size",20)
                ;
        
                
            }
            
            let draw = function(students,data,line,index,xScale,yScale)
            {
                
                
                students.attr("fill",colorScale(index))
                        .select("path")
                        .datum(data[index].grades)
                        .transition()
                        .duration(1000)
                        .attr("class","line")
                        .attr("d",line)
                        .style("stroke",colorScale(index))
                        .style("stroke-width",3)
                        .style("fill","none");;
            }
            
            let newData = function(data)
            {
                let newData=[];
                let temp = [];
                let days = [];
                let day={};
                let student={};
                let i;
                
                for(i=0;i<data.length;i++)
                    {
                        day={};
                        student=data[i];
                        let j;
                        for(j=0;j<student.homework.length;j++)
                            {
                                let list = student.homework[j];
                                if(day[list.day] !== undefined)
                                    {
                                        day[list.day].grade += list.grade * 0.15/(student.homework.length);
                                        day[list.day].max += list.max * 0.15 / (student.homework.length);
                                    }
                                else
                                    {
                                        day[list.day]={};
                                        day[list.day].grade = list.grade * 0.15/(student.homework.length);
                                        day[list.day].max = list.max * 0.15 / (student.homework.length);
                                    }
                            }
                        
                        
                        for(j=0;j<student.quizes.length;j++)
                            {
                                let list = student.quizes[j];
                                if(day[list.day] !== undefined)
                                    {
                                        day[list.day].grade += list.grade * 0.15/(student.quizes.length);
                                        day[list.day].max += list.max * 0.15 / (student.quizes.length);
                                    }
                                else
                                    {
                                        day[list.day]={};
                                        day[list.day].grade = list.grade * 0.15/(student.quizes.length);
                                        day[list.day].max = list.max * 0.15 / (student.quizes.length);
                                    }
                            }
                        
                         for(j=0;j<student.test.length;j++)
                            {
                                let list = student.test[j];
                                if(day[list.day] !== undefined)
                                    {
                                        day[list.day].grade += list.grade * 0.4/(student.test.length);
                                        day[list.day].max += list.max * 0.4/ (student.test.length);
                                    }
                                else
                                    {
                                        day[list.day]={};
                                        day[list.day].grade = list.grade * 0.4/(student.test.length);
                                        day[list.day].max = list.max * 0.4 / (student.test.length);
                                    }
                            }
                        
                        for(j=0;j<student.final.length;j++)
                            {
                                let list = student.final[j];
                                if(day[list.day] !== undefined)
                                    {
                                        day[list.day].grade += list.grade * 0.3/(student.final.length);
                                        day[list.day].max += list.max * 0.3 / (student.final.length);
                                    }
                                else
                                    {
                                        day[list.day]={};
                                        day[list.day].grade = list.grade * 0.3/(student.final.length);
                                        day[list.day].max = list.max * 0.3 / (student.final.length);
                                    }
                            }
                        days.push(day);
                    }
                
    
                for(i=0;i<days.length;i++)
                    {
                        temp.push(Object.values(days[i]));
                    }
                
                for(i=0;i<temp.length;i++)
                    {
                        let element = {};
                        element.pic = data[i].picture;
                        element.grades = [];
                        let j;
                        for(j=0;j<temp[i].length;j++)
                            {
                                temp[i][j].grade;
                                temp[i][j].max;
                                
                                if(j==0)
                                    {
                                        
                                    }
                                
                                else
                                    {
                                        temp[i][j].grade+=temp[i][j-1].grade;
                                        temp[i][j].max+=temp[i][j-1].max;
                                    }
                                //temp[i][j].score=temp[i][j].grade/temp[i][j].max;
                                
                            }
                        element.grades=temp[i];
                        
                        newData.push(element);
                    }
                return(newData);
            }