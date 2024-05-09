export const linearChartData = {
    labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ],

    datasets: [
        {
            label: "Registrations",
            data: [10, 60, 200, 300, 7, 1, 20],

            borderColor: [
                'rgb(255, 99, 132)',
                
              ],
              borderWidth: 2
        },
        {
            label: "Purchases",
            data: [12, 5000, 1500, 1000, 4500, 10, 300],

            borderColor: [
                'rgb(255, 159, 64)',
                
              ],
              borderWidth: 2,
              hoverOffSet: 4

        },
       
    ]

}