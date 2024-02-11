namespace $ {

	export class $mam_bundle_meta extends $mam_bundle {

		@ $mol_mem_key
		generated( slice: $mam_slice ) {
			const start = Date.now()

			const prefix = slice.prefix()
			const meta = slice.pack().output().resolve( `${prefix}.meta.json` )
			const graph = slice.graph()
			const files = [ ... slice.files() ]

			const deps_in = {} as Record< string, Record< string, number > >
			for( const [ dep, pair ] of graph.edges_in ) {

				const dep_path = dep.relate()
				if( !deps_in[ dep_path ] ) {
					deps_in[ dep_path ] = {}
				}

				for( const [ mod, edge ] of pair ) {
					const mod_path = mod.relate()
					deps_in[ dep_path ][ mod_path ] = edge.priority
				}

			}

			const deps_out = {} as Record< string, Record< string, number > >
			for( const [ mod, pair ] of graph.edges_out ) {

				const mod_path = mod.relate()
				if( !deps_out[ mod_path ] ) {
					deps_out[ mod_path ] = {}
				}

				for( const [ dep, edge ] of pair ) {
					const dep_path = dep.relate()
					deps_out[ mod_path ][ dep_path ] = edge.priority
				}

			}

			const size = {} as Record< string, number >
			for( const file of files ) {
				size[ file.relate() ] = file.size()
			}

			const json = {
				deps_in,
				deps_out,
				order: files.map( file => file.relate() ),
				size,
			}
			
			const text = JSON.stringify( json, null, '\t' )

			meta.text( text )

			this.log( meta, Date.now() - start )

			return [ meta ]
		}

	}
	
}
