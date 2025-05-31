import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Button, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { render } from '@testing-library/react';

const Tab1: React.FC = () => {
  const [loadingTable, setloadingTable] = useState(false);

  interface Report {
    report_name: string,
    type_id: number,
    report_value: number,
    created_date: string
  } 

  const column = [
    {
      title: 'Report Name',
      dataIndex: 'report_name',
      key: 'report_name'
    },
    {
      title: 'Report type',
      dataIndex: 'type_id',
      key: 'type_id'
    },
    {
      title: 'Nominal',
      dataIndex: 'report_value',
      key: 'report_value',
      render: (data: Number, record: Report) => {
      return (
        <div>
          {record.type_id === 1  && <span >{`${data}`}</span>}
          {record.type_id === 2  && <span style={{color: "red"}}>{`${data}`}</span>}
        </div>
      );
      }
    },
    {
      title: 'Date',
      dataIndex: 'created_date',
      key: 'created_date'
    }
  ]

  const dataSource = [
    {
      "report_name": "jajan",
      "type_id": 2,
      "report_value": 5000,
      "created_date": "2025-03-01"
    },{
      "report_name": "jajan",
      "type_id": 2,
      "report_value": 5000,
      "created_date": "2025-03-01"
    },{
      "report_name": "Gaji",
      "type_id": 1,
      "report_value": 15000,
      "created_date": "2025-03-01"
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h5>Welcome, eson</h5>
        <h5>Current State Rp. 5000</h5>
        <div>
          <Input placeholder='income name'></Input> 
          <Input placeholder='income value'></Input> 
          <div style={{display: "flex", alignItems:"center", marginTop: "20px"}}>
            <Button style={{ width: '50%', marginRight: "10px" }}>Income</Button>
            <Button style={{ width: '50%' }}>Outcome</Button>
          </div>
          <div>
            <h5 style={{marginLeft: "30%"}}>This month report</h5>
            <div style={{display: "flex", alignItems:"center", marginTop: "10px", marginBottom: "10px"}}>
              <span style={{width: '50%'}}>Income: Rp. 10000</span>
              <span style={{width: '50%'}}>Outcome: Rp. 5000</span>
            </div>
            <div >
              <Table 
                loading={loadingTable}
                columns={column}
                dataSource={dataSource}
              >
                
              </Table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
