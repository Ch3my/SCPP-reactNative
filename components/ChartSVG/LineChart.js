import Svg, { G, Circle, Path, Line, Polyline, Text } from "react-native-svg";
import {
    Image, Platform, StyleSheet, TouchableOpacity,
    View, Dimensions, ActivityIndicator
} from 'react-native';


const SVGPADDINGLEFT = 50
const SVGPADDINGTOP = 25


const LineChart = props => {
    // El alto total del Grafico sera el alto que nos pasaron menos un pedazo para
    // las etiquetas
    let chartHeight = props.totalHeight - 80
    let chartWidth = props.totalWidth - 50

    // SVG 0,0 es la esq sup izq
    console.log(props);
    // totalHeight<Integer>, totalWidth<Integer>, dataset<Obj Arr>, labels<String Array>
    // datasets: [{data:[], color: String }]

    // Buscar el higherPoint mas alto de dataset
    // y pasar ese para a la funcion que crea los dataset, asi todos usan el mismo ratio
    let higherPoint = 0
    for (let d of props.datasets) {
        let datasetHigherPoint = Math.max(...d.data)
        if (higherPoint < datasetHigherPoint) {
            higherPoint = datasetHigherPoint
        }
    }

    let paths = []
    for (let [index, d] of props.datasets.entries()) {
        paths.push(
            buildPath(chartHeight, chartWidth, d, index, higherPoint)
        )
    }

    console.log(props.labels);
    let labels = buildLabels(chartWidth, chartHeight, props.labels)

    return (
        <View style={styles.chartContainer}>
            <Svg height={props.totalHeight} width={props.totalWidth}>
                {paths}
                <Line x1={SVGPADDINGLEFT} y={chartHeight + SVGPADDINGTOP} x2={chartWidth} strokeWidth="3" stroke="blue" />
                <Line x={SVGPADDINGLEFT} y1={chartHeight + SVGPADDINGTOP} y2={0 + SVGPADDINGTOP} strokeWidth="3" stroke="blue" />

                {labels}
            </Svg>
        </View>
    )
}

const buildLabels = (chartWidth, chartHeight, labels) => {
    let xSeparation = Math.round(chartWidth / labels.length)

    let labelsComp = []
    for (let [index, l] of labels.entries()) {
        let xCordinate = SVGPADDINGLEFT + (xSeparation * index)
        let yCordinate = (chartHeight + SVGPADDINGTOP) + 25

        labelsComp.push(
            <Text key={index} x={xCordinate} y={yCordinate}
                stroke="white" fontWeight="100" textAnchor="middle"
                rotation={-30} originX={xCordinate} originY={yCordinate}>{l}</Text>
        )
    }
    return labelsComp
}

const buildPath = (totalHeight, totalWidth, dataset, index, higherPoint) => {
    // dataset {data:[], color: Function }
    let d = buildPathD(totalHeight, totalWidth, dataset.data, higherPoint)
    return (
        <Path
            d={d}
            fill="none"
            stroke={dataset.color}
            strokeWidth="3"
            key={index}
        />
    )
}

const buildPathD = (totalHeight, totalWidth, dataset, higherPoint) => {
    // Para calcular cada X simplemente tomaremos el totalWidth y lo dividiremos por
    // dataset.length asi cada uno quedara a la misma separacion
    let xSeparation = Math.round(totalWidth / dataset.length)
    // pointCoordinates es un array de Objetos [{x:Integer, y:Integer}]
    let pointCoordinates = []

    // Encontrar el punto mas alto del dataset para crear ratio con el tamaño del grafico
    // var higherPoint = Math.max(...dataset)
    var yRatio = higherPoint / totalHeight

    // Construimos d de un dataset
    let d = ``

    // Hacemos loop y marcamos cada punto
    // Como 0.0 es arriba tenemos que cambiar la orientacion de Y
    // como si 0.0 fuera abajo
    for (let [index, p] of dataset.entries()) {
        pointCoordinates.push({
            x: (index * xSeparation) + SVGPADDINGLEFT,
            y: (totalHeight - (p / yRatio)) + SVGPADDINGTOP
        })
    }

    for (let [index, p] of pointCoordinates.entries()) {
        if (index == 0) {
            // Primer punto setea la posicion del puntero
            d += `M${p.x} ${p.y} `
        } else {
            // Todos los demas van dibujando
            d += `L${p.x} ${p.y} `
        }
    }
    return d
}

const styles = StyleSheet.create({
    chartContainer: {
        // borderColor: "green",
        // borderStyle: "solid",
        // borderWidth: 1,
        // paddingLeft: 50,
        // paddingTop: 50,
        // paddingBottom: 50,
        // paddingRight: 50,
    },
});

export default LineChart;