import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		issues: [],
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
		all: [],
		issues: [],
		loading: false
	},
	mutations: {
		setState(state,payload) {
            Vue.set(state,payload.key,payload.value)
        },
        resetState (state) {
            Object.assign(state, getDefaultState())
        },
	},
	actions: {
		resetState({commit}) {
            commit('resetState')
        },
        initiateScan({rootState}, args){
            Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/scan/init`, {params: { scan_options: args.config, pages: args.pages, domain: args.domain, id: args.id, relationship: args.relationship }})
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "A scan has been initiated.",
						type: "success"
					})
				})
				.catch( re=>console.log(re))
				.then()
        },
		getProjectScans({state, rootState}, args){
			state.loading = true;
			Request.getPromise( `${rootState.auth.userAPI}/${rootState.auth.account}/scan/project/${args.project_id}/scans` )
			.then( re => state.all = re.data.details )
			.catch( re => {
				console.log(re)
			})
			.then( ()=> state.loading = false)
		},
		deleteScan({state, rootState}, args){
			state.loading = true
			Request.destroyPromise( `${rootState.auth.userAPI}/${rootState.auth.account}/scan/${args.scan_id}`)
			.then( re=>state.all = re.data.details)
			.catch( re=>console.log(re))
			.then( () => state.loading = false )
		}
	},
	getters: { 
		
	},
}