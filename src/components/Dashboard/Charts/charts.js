
import Chart from "react-apexcharts";

const AreaChart = ({ sales,expense, categoriesArray }) => {
    return (
        <Chart
            options={{
                xaxis: {
                    categories: categoriesArray
                },
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: false
                }, grid: {
                    show: false
                },
                chart: {
                    redrawOnParentResize: true,
                    width: '100%',
                }, 
                fill: {
                    colors: ['#90EE90', '#ff6666']
                },
            }}
            series={[{
                name: 'Sales',
                data: sales
            }, {
                name: 'Expense',
                data: expense
            }]}
            type="area"
            height={400}
            width={'100%'}
        />
    )
}

const AreaChartCard = ({ categoriesArray, series, color,name }) => {
    return (
        <Chart
            options={{
                xaxis: {
                    categories: categoriesArray,
                    labels: {
                        show: false, // This line hides the x-axis labels
                    }, axisBorder: {
                        show: false // Hides the border of the x-axis
                    }, 
                    axisTicks: {
                        show: false // Hides the X-axis ticks
                    }
                },
                yaxis: {
                    labels: {
                        show: false, // This line hides the x-axis labels
                    },
                     axisBorder: {
                        show: false // Hides the border of the x-axis
                    }, 
                },
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: false
                },
                chart: {
                    redrawOnParentResize: true,
                    width: '90%',
                    toolbar: {
                        show: false
                    },
                },
                grid: {
                    show: false // Hides the entire grid area, including its borders
                }, 
                fill: {
                    colors: [color]
                },
            }}
            series={[{
                name: name,
                data: series
            }]}
            type="area"
            width={'90%'}
            height={100}
        />
    )
}
const BarChart = ({ dataArray, onSelected, setFromDate, setToDate }) => {
    //const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return (
        <Chart
            options={{
                stroke: {
                    curve: 'smooth',          
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#FFFFFF"]                     
                    }
                }, 
                plotOptions: {
                    bar: {
                        borderRadius: 12,
                        dataLabels: {
                            position: 'center', // top, center, bottom                      
                        },
                    }
                }, 
                grid: {
                    show: false
                },
                chart:{
                    events: {
                        dataPointSelection: (event, chartContext, config) => {          
                            const dataPointIndex = config.dataPointIndex;
                            dataArray.find((item, index) => {
                                if (index === dataPointIndex) {
                                    setFromDate(item.frm);
                                    setToDate(item.to)
                                }
                            });
                            onSelected('Order');      
                        } 
                         
                    }    
                }
                
            }}
            series={[{
                name: 'Orders',
                data: dataArray.map(a => ({ x: a.month, y: a.count}))
                 //data: dataArray.map(a => ({ x: a.month, y: a.count, fillColor: months[dayjs().get('month')] === a.month ? '#a3c2c2' : '' }))
            }]}
        
            type="bar"
            height={400}
            width={'100%'}
        />
    )
}
const PieChart = ({ series }) => {
    return (
        <Chart
            options={{
                labels: ['Pending','In Progress', 'Completed', 'Cancelled'],
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: true
                }, grid: {
                    show: false
                },
                fill: {
                    colors: ['#ffdd99', '#99ddff', '#a6f2a6', '#ff9999', ]
                },
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                    },
                }
            }}
            series={series}
            type="pie"
            height={300}
            width={'100%'}
        />)
}
const StackedBarChart = ({ categories, pending,inprogress,completed,cancelled }) => {
    return (
        <Chart
            options={{
                dataLabels: {
                    enabled: true
                }, grid: {
                    show: false
                },
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                }, 
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            total: {
                                enabled: true,
                                offsetX: 0,
                                style: {
                                    fontSize: '10px',
                                    fontWeight: 200
                                }
                            }
                        }
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: categories,
                    labels: {
                        formatter: function (val) {
                            return val 
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val 
                        }
                    }
                },
                fill: {
                    opacity: 1,
                    colors: ['#ffdd99', '#99ddff', '#a6f2a6', '#ff9999',]
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }}
            series={[{
                name: 'Pending',
                data: pending,
            }, {
                name: 'In Progress',
                data: inprogress
            }, {
                name: 'Completed',
                data: completed
            }, {
                name: 'Cancelled',
                data: cancelled
            }]}
            type="bar"
            height={400}
            width={'100%'}
        />
    )
}
//colors: ['#FFD580','#80d4ff','#90EE90', '#ff6666', ]
export { AreaChart, BarChart, PieChart, StackedBarChart, AreaChartCard }