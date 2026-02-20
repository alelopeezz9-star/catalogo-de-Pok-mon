const inst = Vue.createApp({
    created() {
        this.cargarPersonajes();
    },

    data() {
        return {
            personajes: [], 
            personajesFiltrados: [], 
            seleccionarCategoria: 'Todos',
            busqueda: '',
            seleccionado: null,
            categorias: ['Todos', 'grass', 'fire', 'water']
        }
    },

    computed: {
        calcularProgreso() {
            if (this.personajes.length === 0) return 0;
            let porcentaje = (this.personajesFiltrados.length / this.personajes.length) * 100;
            return porcentaje.toFixed(0); 
        }
    },

    methods: {
        async cargarPersonajes() {
            try {
                for (let i = 1; i <= 50; i++) {
                    const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
                    const pokemon = {
                        id: respuesta.data.id,
                        name: respuesta.data.name,
                        image: respuesta.data.sprites.other['official-artwork'].front_default,
                        types: respuesta.data.types.map(t => t.type.name),
                        altura: respuesta.data.height,
                        peso: respuesta.data.weight,
                        experiencia: respuesta.data.base_experience
                    };
                    this.personajes.push(pokemon);
                }
                this.personajesFiltrados = this.personajes;
            } catch (error) {
                console.error("Error", error);
            }
        },

        filtrarPorCategoria(categoria) {
            this.seleccionarCategoria = categoria;
            this.aplicarFiltros();
        },

        aplicarFiltros() {
            let resultado = this.personajes;
            if (this.seleccionarCategoria !== 'Todos') {
                resultado = resultado.filter(p => p.types.includes(this.seleccionarCategoria));
            }
            if (this.busqueda) {
                resultado = resultado.filter(p => p.name.toLowerCase().includes(this.busqueda.toLowerCase()));
            }
            this.personajesFiltrados = resultado;
        },

        abrirDetalle(pokemon) {
            this.seleccionado = pokemon;
            const modalElement = document.getElementById('modalPokemon');
            const miModal = new bootstrap.Modal(modalElement);
            miModal.show();
        },

    },

    watch: {
        busqueda() {
            this.aplicarFiltros();
        }
    }
});

const app = inst.mount("#contenedor");