import {getDataSource} from "./index"
import {Tag} from "./entities"

export async function getTags() {
	const dataSource = await getDataSource()

	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const tagRepository = dataSource.getRepository(Tag)
		const tags = await tagRepository.find({
			select: {
			id : true,
			name : true
			},
		})
	
		return tags
	} catch (error) {
		console.error('Error fetching tags: ', error)
		throw error
	} finally {
		await dataSource.destroy()
	}
}