import React, { Component } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import { jsPDF } from "jspdf"
import { BackendServices } from "../../services";
import * as moment from 'moment';
import { translationHelpers } from '../../helpers/translation-helper';
import {
  Button,
  Label,
  Input,
  CardHeader,
  CardTitle,
  InputGroup,
  Table,
  CardFooter
} from "reactstrap"
import ApexCharts from "apexcharts";
import "jspdf-autotable";

const [t] = translationHelpers('translation');

class SalesAnalytics extends Component {

  constructor(props) {
    super(props)
    this.backendServices = new BackendServices();
    this.inicialize();

    this.state = {
      series: [],
      options: {
        labels: [],
        plotOptions: {
          pie: {
            donut: {
              size: '75%'
            }
          }
        },
        legend: {
          show: false,
        },
        colors: ['#3b5de7', '#45cb85', '#eeb902'],
        events: {
          dataPointSelection: (event, chartContext, config) => {
            console.log(config.w.config.labels[config.dataPointIndex])
          }
        },
        chart: {
          id: "chartStatistics",
          events: {
            dataPointSelection: (event, chartContext, config) => {
              let options = config.w.config.labels[config.dataPointIndex];
              let statistic = this.state.statistics.filter(statistic => statistic.activityBpmName === options);
              let dataRows = statistic.map(statistic => (
                [<tr key={statistic.transactId}>
                  <td>
                    {statistic.transactId}
                  </td>
                  <td>
                    {statistic.processBpmName}
                  </td>
                  <td>
                    {statistic.activityBpmName}
                  </td>
                  <td>
                    {statistic.name}
                  </td>
                  <td>
                    {this.formatDate(statistic.date)}
                  </td>
                </tr>]
              ));
              this.setState({ ...this.state, detailStatistic: statistic, dataRows });
              props.setdataRows({ ...this.state, detailStatistic: statistic, dataRows })
            }
          },
          // toolbar: {
          //   show: true,
          //   offsetX: 0,
          //   offsetY: 0,
          //   tools: {
          //     download: true,
          //     selection: true,
          //     zoom: true,
          //     zoomin: true,
          //     zoomout: true,
          //     pan: true,
          //     reset: true | '<img src="/static/icons/reset.png" width="20">',
          //     customIcons: []
          //   },
          // },
          // export: {
          //   csv: {
          //     filename: undefined,
          //     columnDelimiter: ',',
          //     headerCategory: ['category', 'category2'],
          //     headerValue: ['value', 'value2'],
          //     dateFormatter(timestamp) {
          //       return new Date(timestamp).toDateString()
          //     }
          //   },
          //   svg: {
          //     filename: 'banesco_statistic',
          //   },
          //   png: {
          //     filename: 'banesco_statistic',
          //   }
          // },
          // autoSelected: 'zoom'
        },
        statistics: [],
        detailStatistic: null,
        dataRows: null
      }
    }
  }

  inicialize() {
    this.backendServices.getBpmStatisticsvm().then(resp => {
      let processBpmId = this.groupBy(resp, "activityBpmName");
      let labels = processBpmId.map(process => process.at(0).activityBpmName);
      let series = processBpmId.map(process => process.length);
      this.setState({ ...this.state, series, options: { ...this.state.options, labels }, statistics: resp });
    }).catch(err => { })
  }

  /**
   * groupBy, agrupa los items de un JSON
   * @param {Array} collection array JSON
   * @param {string} property clave a agrupar
   * @returns {Array}
   */
  groupBy(collection, property) {
    var i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  downloadPDF() {
    var chart = new ApexCharts(document.querySelector("#chartStatistics"), this.state.options);
    ApexCharts.exec("chartStatistics", "dataURI").then(({ imgURI }) => {
      const pdf = new jsPDF();
      pdf.addImage(imgURI, 'PNG', 36, 30, 130, 60);
      pdf.setFontSize(25);
      pdf.setTextColor('#007953');
      pdf.text(t("Statistics"), 15, 15);

      const headers = [[t("Procedure"), t("Process"), t("Activity"), t("Date")]];

      let content = {
        startY: 100,
        head: headers,
        // body: this.state.detailStatistic?.map(Statistic => [Statistic.transactId, Statistic.processBpmName, Statistic.activityBpmName, this.formatDate(Statistic.date)]) ?? [],
        html: '#tableStatistic',
        styles: { halign: 'center' },
        headStyles: { fillColor: [0, 121, 83] },
        // alternateRowStyles: { fillColor: [174, 217, 203] },
        tableLineColor: [0, 121, 83], tableLineWidth: 0.1,
      };
      document.querySelector("#tableStatistic") && pdf.autoTable(content);
      pdf.save("banesco_statistics.pdf");
    });
  }

  downloadExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;charset=utf-8;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></meta><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {

      ApexCharts.exec("chartStatistics", "dataURI").then(({ imgURI }) => {

        const byteCharacters = atob(imgURI.replace('data:image/png;base64,', ''));

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {
          worksheet: name || 'Worksheet',
          table: table.innerHTML,
          img: imgURI,
        }
        window.location.href = uri + base64(format(template, ctx))
      });



    }
  })()

  render() {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Estadísticas</h4>
            {/* <div className="d-flex flex-row justify-content-between">
              <Button color="success" className="mdi mid-12px" onClick={() => { this.downloadPDF() }}>PDF</Button>
              <Button color="success" className="mdi mid-12px" onClick={() => { this.downloadExcel('tableStatistic', 'banesco_statistics') }}>Excel</Button>
            </div> */}
            <Row className="align-items-center">
              <Col id="tests">
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="donut"
                  height={245}
                  onClick={(e) => { }}
                  className="apex-charts"
                  id="chartStatistics"
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }
}

export default SalesAnalytics
