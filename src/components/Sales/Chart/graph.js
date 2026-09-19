
import Chart from "react-apexcharts";
const Bar = ({sales,tip,tax,categories}) => {
    return (
        <Chart
            options={{
                xaxis: {
                    categories: categories
                },
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: false
                },
                 fill: {
                     colors: ['#90EE90', '#FFD580','#ff6666']
                }, grid: {
                    show: false
                },
            }}
            series={[{
                name: 'Sales',
                data: sales
            }, {
                name: 'Tip',
                data: tip
            }, {
                name: 'Tax',
                data: tax
            }]}
            type="bar"
            height={300}
        />)
}

const Pie = ({ series }) => {
    return (
        <Chart
            options={{
                labels: ['Sales', 'Tip', 'Tax'],
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: true
                }, grid: {
                    show: false
                },
                fill: {
                    colors: ['#90EE90',  '#FFD580','#ff6666']
                },
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                    },
                }
            }}
            series={series}
            type="pie"
            height={200}
            width={'100%'}
        />)
}
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
            }
           // , {name: 'Expense',data: expense }
             ]}
            type="area"
            height={400}
            width={'100%'}
        />
    )
}

export { Bar, Pie, AreaChart }