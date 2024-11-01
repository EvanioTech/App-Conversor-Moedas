import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator,TextInput,TouchableOpacity,Keyboard } from 'react-native';
import { PickerItem } from './src/Picker';
import { useState,useEffect } from 'react';
import { api } from './src/Services/api';


export default function App() {
  const [moedas,setMoedas] = useState([]);
  const [loading,setLoading] = useState(true);
  const [moedaSelecionada,setMoedaSelecionada] = useState (null);
  const [moedaBValor,setMoedaBValor] = useState(0)
  
  const[valorMoeda,setValorMoeda] = useState(null);
  const[valorConvertido,setValorConvertido] = useState(0);


  useEffect(()=> {
    async function loadMoedas(){
      const response =await api.get('all')
      
      let arrayMoedas = [];
      Object.keys(response.data).map((key)=>{
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        })
      })

      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false);
    }
    loadMoedas();
  }, [])



  async function converter(){
    if(moedaBValor === 0 || moedaBValor === '' || moedaSelecionada === null){
      return;
    }
     const response = await api.get(`/all/${moedaSelecionada}-BRL`)
      console.log(response.data[moedaSelecionada].ask)

     let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));


     setValorConvertido(`${resultado.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}`)
     setValorMoeda(moedaBValor)
  
    Keyboard.dismiss();
  
  
    }



  if(loading){
    return(
      <View>
        <ActivityIndicator color= '#FFF' size='large' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.textoMoeda}>Selecione sua Moeda</Text>
      <PickerItem
      moedas={moedas}
      moedaSelecionada={moedaSelecionada}
      onChange={(moeda)=>{
        setMoedaSelecionada(moeda)
      }}
      />
      </View>

      <View style={styles.areaValor}>
      <Text style={styles.titulo}> Digite um valor (R$)</Text>
      <TextInput placeholder='ex:2,50'
      style={styles.input}
      keyboardType='numeric'
      value={moedaBValor}
      onChangeText={(valor)=> setMoedaBValor(valor)}
      />
      </View>
      <TouchableOpacity style={styles.btnArea} onPress={converter}>
        <Text style={styles.btnText}>
          Converter
        </Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
        <Text style={styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
        <Text style={{fontSize:18,margin:8, fontWeight:'500', color:'#000'}}> corresponde a</Text>
        <Text style={styles.valorConvertido}>{valorConvertido}</Text>
      </View>
      )}

      

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:40,
  },
  areaMoeda:{
    backgroundColor: '#FFF',
    width:'90%',
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    padding:8,
    marginBottom:1,

  }
  ,
  textoMoeda:{
    textAlign:'center',
    fontSize:16,
    color: '#000',
    fontWeight:'500',
    paddingLeft:5,
    paddingTop:5,
  },
  areaValor:{
    backgroundColor: '#FFF',
    width:'90%',
    paddingLeft:8,
    paddingBottom:8,
  },
  input:{
    width:'100%',
    padding:8,
    fontSize:18,
    color:'#000'
  },
  btnArea:{
    backgroundColor: '#fb4b57',
    width:'90%',
    height:45,
    alignItems:'center',
    justifyContent:'center',
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
    
  },
  btnText:{
    color:'#000',
    fontWeight:'bold',
    fontSize:16,
  },
  areaResultado:{
    width:'90%',
    backgroundColor: '#FFF',
    marginTop:34,
    borderRadius:8,
    alignItems:'center',
    justifyContent: 'center',
    padding:24,

  },
  valorConvertido:{
    fontSize:28,
    color:'#000',
    fontWeight:'bold'
  }
});
