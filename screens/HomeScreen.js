import React, {useEffect, useLayoutEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import {Text, Avatar, ListItem} from 'react-native-elements'
import {auth, db} from '../firebase'
import {StatusBar} from 'expo-status-bar'
import {AntDesign, Feather, FontAwesome5} from '@expo/vector-icons'
import CustomListItem from '../components/CustomListItem'
import { registerRootComponent } from 'expo';

const HomeScreen = ({navigation}) => {
  const signOutUser = () => {
    auth
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => alert(error.message))
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Expense Tracker',
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation])

  // transactions
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    const unsubscribe = db
      .collection('expense')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) =>
          setTransactions(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          ) &
          setTotalIncome(
            snapshot.docs.map((doc) =>
              doc.data()?.email === auth.currentUser.email &&
              doc.data()?.type == 'income'
                ? doc.data().price
                : 0
            )
          ) &
          setTotalExpense(
            snapshot.docs.map((doc) =>
              doc.data()?.email === auth.currentUser.email &&
              doc.data()?.type == 'expense'
                ? doc.data().price
                : 0
            )
          )
      )

    return unsubscribe
  }, [])

  // stufff
  const [totalIncome, setTotalIncome] = useState([])
  const [income, setIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState([])
  const [expense, setExpense] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  useEffect(() => {
    if (totalIncome) {
      if (totalIncome?.length == 0) {
        setIncome(0)
      } else {
        setIncome(totalIncome?.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
    if (totalExpense) {
      if (totalExpense?.length == 0) {
        setExpense(0)
      } else {
        setExpense(totalExpense?.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
  }, [totalIncome, totalExpense, income, expense])

  useEffect(() => {
    if (income || expense) {
      setTotalBalance(income - expense)
    } else {
      setTotalBalance(0)
    }
  }, [totalIncome, totalExpense, income, expense])

  const [filter, setFilter] = useState([])
  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        )
      )
    }
  }, [transactions])

  return (
    <>
      <View style={styles.container}>
        <StatusBar style='dark' />
        <View style={styles.fullName}>
          <Avatar
            size='medium'
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>Welcome</Text>
            <Text h4 style={{color: '#4A2D5D'}}>
              {auth.currentUser.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{textAlign: 'center', color: 'aliceblue'}}>
              Total Balance
            </Text>
            <Text h3 style={{textAlign: 'center', color: 'aliceblue'}}>
              ₦{totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name='arrow-down' size={18} color='lightgreen' />
                <Text
                  style={{
                    textAlign: 'center',
                    marginLeft: 5,
                  }}
                >
                  Income
                </Text>
              </View>
              <Text h4 style={{textAlign: 'center'}}>
                {`$ ${income?.toFixed(2)}`}
              </Text>
            </View>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name='arrow-up' size={18} color='red' />
                <Text style={{textAlign: 'center', marginLeft: 5}}>
                  Expense
                </Text>
              </View>
              <Text h4 style={{textAlign: 'center'}}>
                {`$ ${expense?.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTitle}>
          <Text h4 style={{color: '#fff'}}>
            Recent Transactions
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('All')}
          >
            <Text style={styles.seeAll}>All Transactions</Text>
          </TouchableOpacity>
        </View>

        {filter?.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name='empty-set' size={24} color='#EF8A76' />
            <Text  style={{color: '#999'}}>
              No Transactions
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name='home' size={24} color='#F6AB5A' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.5}
        >
          <AntDesign name='plus' size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('All')}
        >
          <FontAwesome5 name='list-alt' size={24} color='#F6AB5A' />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    color: '#fff'
  },
  fullName: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#444',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#111',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 0,
  },
  cardTop: {
    // backgroundColor: 'blue',
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#F6AB5A',
    borderRadius: 20,
  },
  cardBottomSame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'lightgreen',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#F6AB5A',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
})


registerRootComponent(HomeScreen)
