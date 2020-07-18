import React from 'react'
import { Bar } from 'react-chartjs-2'
import Axios from 'axios'
import { API_URL } from '../../../../../redux/API'

class AdminReports extends React.Component {
    state = {
        gameList: [],
        barData: {
            labels: [],
            datasets: [
                {
                    label: 'Sold',
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: []
                }
            ]
        }
        
    }

    componentDidMount(){
        this.getAllGame()
    }

    getAllGame = () =>{
        Axios.get(`${API_URL}/game`)
        .then((res) =>{
            console.log(res.data)
            this.setState({gameList : res.data})
            this.setBarData()
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    setBarData = () =>{
        return this.state.gameList.map(val =>{
            return(
                this.setState({
                    barData:{
                        ...this.state.barData, labels : [...this.state.barData.labels, val.name],
                        datasets :this.state.barData.datasets.map((value) =>({
                            ...value, 
                            data:[...value.data, val.sold ]
                        }))
                    },
                    
                })
            )
        })
    }

    render() {
        return (
            
            <div className="container">
                Ini admin Report
                <Bar
                    data={this.state.barData}
                    options={{
                        title: {
                            display: true,
                            text: 'Jumlah Game Terjual',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
                
            </div>
        )
    }
}

export default AdminReports