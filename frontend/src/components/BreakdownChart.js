import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";

function BreakdownChart(props) {
  const breakdownChartCanvasRef = useRef();

  const breakdownChartData = {
    labels: props.breakdown.map((obj) => obj.label),
    datasets: [
      {
        label: props.label,
        data: props.breakdown.map((obj) => obj.value),
      },
    ],
  };

  const breakdownChartConfig = {
    type: "pie",
    data: breakdownChartData,
    options: {
      plugins: {
        title: {
          display: true,
          text: props.title,
        },
      },
    },
  };

  useEffect(() => {
    const breakdownChartCtx = breakdownChartCanvasRef.current.getContext("2d");
    Chart.register(Colors);
    const breakdownChart = new Chart(breakdownChartCtx, breakdownChartConfig);
  }, []);

  return (
    <div className="w3-container w3-center">
      <div>
        <canvas ref={breakdownChartCanvasRef}></canvas>
      </div>
    </div>
  );
}

export default BreakdownChart;
