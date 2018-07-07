   
        //var dataset = undefined; //for debug
        
        //basic setup
            let colorScale_donut = d3.scaleOrdinal(d3.schemeCategory20b);
            let index = 0;
            let total = 100;
            let padding = {top:50,right:50,bottom:50,left:50};
            let margin = {top:50,right:50,bottom:50,left:50};
            let width = 950-margin.left-padding.left;
            let height = 650-margin.top-padding.top;
            let thickness = 70;
            let duration = 1500;  
            let radius = 550 / 2; 
            let side_donut = 45;

            let svg = d3.select("#chart")
                .append('svg')
                .attr('class', 'pie')
                .attr('width', width)
                .attr('height', height)
                ;
            
            let pieChart = svg.append('g')
                 .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')')
                 .attr("class", "piechart");
            
            let label = svg.append('g')
                .attr("class", "label")
                .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')')
            	;
            
            let legend = svg.append('g')
                .attr("class", "legend")
                .attr("transform","translate(760,0)");
            
            let arc = d3.arc()
                .innerRadius(radius - thickness)
                .outerRadius(radius);
            
            let arc1 = d3.arc()
                .innerRadius(50)
                .outerRadius(70);
            
            let pie = d3.pie()
                .startAngle(-135 * Math.PI/180)
	            .endAngle(-135  * Math.PI/180 + 2*Math.PI)
                .value(function(dataset,index) { return dataset; })
                .sort(null);

            
            d3.json("data/classData.json", function(error, data){   
                if(error){
                    document.write("<b> ERROR! </b>"+ error.currentTarget.responseText);
                    return;}
                else{
                       
                    let dataset = newData_donut(data,index); 

                    chart(dataset[index],index,dataset,data);
                    //drawlegend(data); 

                    }//end else
            } ); //end json
            
            let color = d3.scaleOrdinal()
             .domain([0,5])
             .range(["#999",  "#56438e","#794b85","#d674a3","#c66276","#1a3199"]);

            let color1 = ["#999" , "#56438e","#794b85","#d674a3","#c66276","#1a3199"];
            
            //console.log(color1);
            let color2 = d3.scaleOrdinal()
             .domain([0,5])
             .range(["#56438e","#794b85","#d674a3","#c66276","#1a3199"]);
            
            
            

            
            let chart = function(dataset,index,dataupdate, data)  {               
                    //console.log("chart index",index);
                    //console.log("chart",dataset);
                
                    let path = pieChart.selectAll("path")
                        .data(pie(dataset))
                        .enter()
                        .append("path")
                        .attr("d",arc)
                        .attr("id", function(d,i){ return "path"+i;})
                        .attr('fill', (dataset,i) => color(i)) 
                        .transition()
                        .duration(duration)
                        .attrTween("d",tween);

                
                    pieChart.append("text")
                        .attr("class", "middle-text")
                        .text("Overall Grade:")
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",26)
                        .attr('dy', '-0px');
                    
                    pieChart.append("text")
                        .attr("class", "middle-text")
                        .text(Math.round(100-dataset[0])+"%")
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",26)
                        .attr('dy', '30px');
                
                    pieChart.append("text")
                        .attr("class", "middle-text")
                        .text("Student "+(index+1))
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",30)
                        .style("font-family","Playfair Display")
                        .attr('dy', '-40px');
                
                    pieChart.select ("#path0")
                         .style("color","white");
                    
                
                    pieChart.selectAll("path")
                        .on("mouseover", function(d,i) {
                            d3.select(this)    
                               /* .transition()
        ----->                        .duration(duration)*/      
                                .style("cursor", "pointer")
                                .style("opacity", 0.5);  
                        
                            label.append("circle")
                                .attr("id","tooltip2")
                                .attr("r", radius-thickness-75)
                                .attr('fill', function(){       //console.log(i); 
                                    return color(i);}) 
                                .attr("opacity",1);
                        
                            label.selectAll("circle")
                                .transition().duration(duration-1000)
                                .attr("r", radius-thickness-15);
                        
                            label.append("text")
                                .data(pie(dataset))
                                .attr("id","tooltip")
                                .attr("d", this.arc)
                                .attr("text-anchor", "middle")
                               .text( function(){ 
                                //console.log(i)
                                return explain(dataset,index,i)+ percent(dataset,index,i)})
                                .attr('dy', '-10px')
                                .style("font-size",26)
                                .attr('fill', "#fff") ;
                        
                            label.append("text")
                                .data(pie(dataset))
                                .attr("id","tooltip1")
                                .attr("d", this.arc)
                                .attr("text-anchor", "middle")
                                .text( function(){ 
                                //console.log(i)
                                    return explain1(dataset,index,i)})
                                .attr('dy', '10px')
                                .attr('fill', "#fff") ;              
                    
                        })//end mouseover
                    
                        .on("mouseout", function(d) {
                            d3.select(this)
                                .style("cursor", "none")  
                                .style("opacity", 1);
                            d3.select("#tooltip").remove();
                            d3.select("#tooltip1").remove();
                            d3.select("#tooltip2").remove();

                    });//end mouseout

                    legend
                        .selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x",function(d,i){  
                            if(i==11){ return side_donut/2+"";}       
                            if(i>11) {  return side_donut+"";}
                            else{ return "0"; }
                        })
                        .attr("y",function(d,i){
                            if(i>11) { return (i-12)*side_donut+""; }
                            else{ return (side_donut*i)+""; }
                        })
                        .attr("height",side_donut+"")
                        .attr("width",side_donut+"")
                        .attr("fill",function(d,i) { return colorScale_donut(i); });
                        
                
                    legend.selectAll("image")
                        .data(data)
                        .enter()
                        .append("image")
                        .attr("xlink:href",function(d,i) { return d.picture; })
                        .attr("x",function(d,i) {  
                            if(i==11) { return side_donut/2+2.5+""; }    
                            if(i>11){ return side_donut+2.5+"";}
                            else{ return "2.5"; }
                        })
                        .attr("y",function(d,i) {
                            if(i>11) { return (i-12)*side_donut+2.5+"";  }
                            else{   return (side_donut*i)+2.5+""; }
                        })
                        .attr("height",40+"")
                        .attr("width",40+"")
                        .on("click",function(d,i) {
/*    ---->  */             //console.log(dataupdate[i]); 
                            change(dataupdate[i],i);
                        })
                        .on("mouseover",function(d,i) {
                            d3.select(this).attr("height","45").style("cursor", "pointer");
                            d3.select(this).attr("width","45");
                            if(i>11){
                                d3.select(this).attr("x",side_donut+"");
                                d3.select(this).attr("y",(i-12)*side_donut+"");
                            }
                            else {
                                if(i==11) {
                                    d3.select(this).attr("x",side_donut/2+"");
                                    d3.select(this).attr("y",(side_donut*i)+"");
                                }
                                else{
                                    d3.select(this).attr("x","0");
                                    d3.select(this).attr("y",(side_donut*i)+"");
                                }
                            }      
                        })
                        .on("mouseout",function(d,i){
                            d3.select(this).attr("height","40").style("cursor", "none");
                            d3.select(this).attr("width","40");
                            if(i>11)  {
                                d3.select(this).attr("x",side_donut+2.5+"");
                                d3.select(this).attr("y",(i-12)*side_donut+2.5+"");
                            }
                            else{
                                if(i==11) {
                                    d3.select(this).attr("x",side_donut/2+2.5+"");
                                    d3.select(this).attr("y",(side_donut*i)+2.5+"");
                                }
                                else {
                                    d3.select(this).attr("x","2.5");
                                    d3.select(this).attr("y",(side_donut*i)+2.5+"");
                                }
                            }
                        });
            
             ///////////           
                         
                
                let change = function(dataset,index){
                    
                     pieChart
                            .selectAll("path")
                            .transition()
                            .duration(duration)
                            .attrTween("d", tween);

                      svg.selectAll("path").exit().remove();   
                      d3.select(".piechart").selectAll("text").remove() ; //text in the middle
                      svg.selectAll(".valuetext").remove() ; //text on arc
                      label.selectAll("text").exit().remove(); 
                    
                      d3.select("#tooltip").remove();
                      d3.select("#tooltip1").remove();
                      d3.select("#tooltip2").remove();
                    
                    d3.select("#Arc0").remove();
                    d3.select("#Arc1").remove();
                    d3.select("#Arc2").remove();
                    d3.select("#Arc3").remove();
                    d3.select("#Arc4").remove();
                    d3.select("#Arc5").remove();
                    
                    //console.log("change",index)
                    
                    pieChart
                        .selectAll("path")
                        .data(pie(dataset))
                        .enter()
                        .append("path")
                        .attr('fill', (dataset,i) => color(i)) 
                        .attr("d", arc)
                        ;
                    
                    pieChart.append("text")
                        .text("Overall Grade:")
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",26)
                        .attr('dy', '-0px');
                    
                    pieChart.append("text")
                        .text(100-dataset[0]+"%")
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",26)
                        .attr('dy', '30px');
                
                    pieChart.append("text")
                        .text("Student "+(index+1))
                        .attr('text-anchor', 'middle')
                        .attr('fill', "#fff")
                        .style("font-size",30)
                        .style("font-family","Playfair Display")
                        .attr('dy', '-40px');

                    
                     pieChart.selectAll("path")
                        .on("mouseover", function(d,i) {
                            d3.select(this)    
                               /* .transition()
        ----->                        .duration(duration)*/      
                                .style("cursor", "pointer")
                                .style("opacity", 0.5);  
                        
                            label.append("circle")
                                .attr("id","tooltip2")
                                .attr("r", radius-thickness-75)
                                .attr('fill', color(i)) 
                                .attr("opacity",1);
                        
                            label.selectAll("circle")
                                .transition().duration(duration-1000)
                                .attr("r", radius-thickness-15);
                        
                        
                            label.append("text")
                                .data(pie(dataset))
                                .attr("id","tooltip")
                                .attr("d", this.arc)
                                .attr("text-anchor", "middle")
                                .text( function(){ 
                                //console.log(i)
                                return explain(dataset,index,i)+ percent(dataset,index,i)})
                                .attr('dy', '-10px')
                                .attr('fill', "#fff") 
                        
                                .style("font-size",26);
                        
                            label.append("text")
                                .data(pie(dataset))
                                .attr("id","tooltip1")
                                .attr("d", this.arc)
                                .attr("text-anchor", "middle")
                                .text( function(dataset){ 
                                //console.log(i)
                                return explain1(dataset,index,i)})
                                .attr('dy', '10px')
                                .attr('fill', "#fff") ;              
                    
                        })//end mouseover
                    
                        .on("mouseout", function(d) {
                            d3.select(this)
                                .style("cursor", "none")  
                                .style("opacity", 1);
                            d3.select("#tooltip").remove();
                            d3.select("#tooltip1").remove();
                            d3.select("#tooltip2").remove();

                    });//end mouseout
                    
                     

                    }//end change()

             }  //end of chart2 fcn      
                  
  
      
        function explain(dataset,index,i) {
            let a=[];
            a.push("lose: ");
            a.push("final: ");
            a.push("test1: ");
            a.push("test2: ");
            a.push("homework average: ");
            a.push("quiz average: ");
            //console.log(a[i]);   
            return a[i];   
        }   
              
            
        function explain1(dataset,index,i) {
            let a=[];
            //console.log(dataset.data)
            let letter = Math.round(100-dataset.data);
            //console.log(letter)
            let letter1 = "";
            if(letter >= 93){ letter1 = "A";}
            if(letter < 93 & letter >= 90){ letter1 = "A-";}
            if(letter < 90 & letter >= 87){ letter1 = "B+";}
            if(letter < 87 & letter >= 83){ letter1 = "B";}
            if(letter < 83 & letter >= 80){ letter1 = "B-";}
            if(letter < 80 & letter >= 77){ letter1 = "C+";}
            if(letter < 77 & letter >= 73){ letter1 = "C";}
            if(letter < 73 & letter >= 70){ letter1 = "C-";}
            if(letter < 70 & letter >= 60){ letter1 = "D";}
            if(letter < 60){ letter1 = "U";}   
            //console.log(letter)
            if(typeof dataset.data == 'undefined'){ letter1="D";}
            a.push("letter grade: "+letter1);
            a.push("worth 30% of the grade");
            a.push("worth 20% of the grade");
            a.push("worth 20% of the grade");
            a.push("worth 15% of the grade");
            a.push("worth 15% of the grade");
            //console.log(a[i]);
            //console.log(i)
            return a[i];   
        }      
            
            
        function percent(dataset,index,i) {
           
                let a=[];
                a.push(Math.round(dataset[0])+"%");
                a.push(Math.round(dataset[1]/0.3*100)/100+"%");
                a.push(Math.round(dataset[2]/0.2)+"%");
                a.push(Math.round(dataset[3]/0.2)+"%");
                a.push(Math.round(dataset[4]/0.15)+"%");
                a.push(Math.round(dataset[5]/0.15)+"%");
                //console.log(a[i]);

                return a[i];   
            

        }   
            
            
       function tween(b){
           let i =d3.interpolate({startAngle:3*Math.PI, endAngle:3*Math.PI},b);
           return function(t){ return arc(i(t));};
       }     
            
                
    //[[left,final,test1,test2,homework average, quiz average],[student 2],[student 3]]
        let newData_donut = function(data,index){
            let a = [];  
            let a1 = []; //array for hw
            let a2 = []; //array for quiz
            //console.log(data);
            
            for (let i = 0; i<data.length;i++){
                let hw = 0;
                for(let j = 0; j<data[i].homework.length; j++){
                    hw = hw + data[i].homework[j].grade;
                }
                a1.push(Math.round(hw/data[i].homework.length));
            }          
            for (let i = 0; i<data.length;i++){
                let quiz = 0;
                for(let j = 0; j<data[i].quizes.length; j++){
                    quiz = quiz + data[i].quizes[j].grade;
                }
                a2.push(Math.round(quiz/data[i].quizes.length));
            }
                      
            for(let i =0; i<data.length;i++){
                let b = [];
                b.push(Number((100-(Math.round(data[i].final[0].grade*0.3*100)/100+Math.round(data[i].test[0].grade*0.2*100)/100+Math.round(data[i].test[1].grade*0.2*100)/100+Math.round(a1[i]*0.15*2*100)/100+Math.round(a2[i]*0.15*10*100)/100)).toFixed(2)));
                b.push(Math.round(data[i].final[0].grade*0.3*100)/100);
                b.push(Math.round(data[i].test[0].grade*0.2*100)/100);
                b.push(Math.round(data[i].test[1].grade*0.2*100)/100);
                b.push(Math.round(a1[i]*0.15*2*100)/100);
                b.push(Math.round(a2[i]*0.15*10*100)/100);
                a.push(b);
            }

            return a;
        }
        
        
        
        
        
        
        
        
        
