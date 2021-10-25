import Vue from 'vue'
import Cookies from 'js-cookie'

const getDefaultState = () => {
	return {
		all: [],
		projects: [],
		client: false,
		clientID: Cookies.get('toolboxClient'),
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
		all: [],
		projects: [],
		client: false,
		clientID: Cookies.get('toolboxClient'),
		loading: false
	},
	mutations: {
		setState(state,payload) {
			Vue.set(state,payload.key,payload.value)
		},
	},
	actions: {
		resetState (state) {
			Object.assign(state, getDefaultState())
		},
		getProjects({state, rootState}){
			state.loading = true
			
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/projects`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					},
				},
				onSuccess: {
					title: "Success",
					text: "Projects retrieved",
					callback: function(response){
						state.loading = false
						state.projects = response.data.details
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed getting projects",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		getClient({state, rootState}, args){
			state.loading = true
			if ( args.id == -1 )
			{
				state.client = false;
				state.clientID = false;
				state.loading = false;
				Cookies.remove('toolboxClient')
			}
			else {
				Request.get(`${rootState.auth.API}/${rootState.auth.account}/clients/${args.id}`, {
					onSuccess: {
						title:'Success',
						text:'Client retrieved',
						callback: function(response){
							state.loading = false
							state.client = response.data.details
							Cookies.set('toolboxClient', state.client.id, 365)
						}
					},
					onError: {
						title:'Error',
						text:'Getting this client caused an error',
						callback: function(){
							state.loading = false
						}
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem getting the client",
						callback: function(){
							state.loading = false
						}
					}
				})
			}
		},
		createClient({state, rootState}, args){
			state.loading = true;
			Request.post(`${rootState.auth.API}/${args.client.account_id}/clients`, {
				params: {
					client: args.client
				},
				onSuccess: {
					title:'Success',
					text:'Client created. Redirecting to homepage...',
					callback: function(response){
						state.loading = false
						state.client = response.data.created
						state.all = response.data.details
						setTimeout(()=>{
							args.router.push({path: "/"})
						}, 2000)
					}
				},
				onError: {
					title:'Error',
					text:'Creating this client caused an error',
					callback: function(){
						state.loading = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem creating the client",
					callback: function(response){
						state.loading = false
					}
				}
			})
		},
		getClients({state, rootState}){
			state.loading = true
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/clients`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					}
				},
				onSuccess: {
					title: "Success",
					text: "Clients retrieved",
					callback: function(response){
						state.loading = false
						state.all = response.data.details
						
						if( state.all.length ){
							if( state.clientID ){
								state.client = state.all.find( (ob) => ob.id == parseInt(state.clientID) )
							}else{
								state.client = state.all[0]
								state.clientID = state.client.id
							}
						}
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed getting clients",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		updateClient({state, rootState}, args){
			state.loading = true
			let requestArgs = {
				params: {
					client_id: args.id,
					data: args.client
				},
				onSuccess: {
					title: "Success",
					text: "Client updated",
					callback: function(){
						state.loading = false
						// if( rootGetters["auth/isManager"] ){
						// 	args.router.push({path: "/manage/clients"})
						// 	return
						// }
						args.router.push({path: "/"})
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed updating client",
					callback: function(){
						state.loading = false
					}
				}
			};
			Request.post(`${rootState.auth.API}/${rootState.auth.account}/clients/${args.id}`, requestArgs)
		},
	},
	getters: { 
		
	},
}
	