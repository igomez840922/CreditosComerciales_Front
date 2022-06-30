import React from "react"
import ReactApexChart from "react-apexcharts"

const RadialChart = () => {
  const series = [44, 55, 67, 83]
  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 249
            }
          }
        }
      }
    },
    series: [44, 55, 67, 83],
    labels: ['Computer', 'Tablet', 'Laptop', 'Mobile'],
    colors: ['#3b5de7', '#45cb85', '#eeb902', '#ff715b'],
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height="370"
      className="apex-charts"
    />
  )
}

export default RadialChart
