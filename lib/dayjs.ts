import dayjs from "dayjs"
import weekOfYear from "dayjs/plugin/weekOfYear"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"

dayjs.extend(weekOfYear)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export default dayjs
