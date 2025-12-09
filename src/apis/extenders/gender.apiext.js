export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.gender_isnature = 'gender_isnature = ${gender_isnature}'
}