import { defineStore } from 'pinia'
import { sleep } from '@/hooks'
import _ from 'lodash'
export const useStore = defineStore('main', {
	state() {
		return {
			gid: 0,
			queue: [[], [], []] as Progress[][],
			doing: {} as Progress & { qn: number },
			done: [] as Progress[],
			global: {
				queueNum: 3,
				timeSlice: 1,
				cpuSpeed: 1,
			},
		}
	},
	actions: {
		push(
			qnum: number,
			progress: Partial<Progress> & Pick<Progress, 'total' | 'done'>,
		) {
			// 没有指定颜色，则为新任务，随机产生颜色
			if (typeof progress.color === 'undefined') {
				progress.color =
					'#' + ((Math.random() * 0xffffff) << 0).toString(16)
			}
			// 没有指定id，则为新任务，指定id并自增全局id
			if (typeof progress.id === 'undefined') {
				progress.id = this.gid++
			}
			this.queue[qnum].push(progress as Progress)
		},
		clear() {
			// 清空
			this.queue = [[]]
		},
		shift(qnum: number) {
			// 弹出队首
			return this.queue[qnum].shift()
		},
		delete(qnum: number, id: number) {
			// 删除指定任务
			this.queue[qnum].splice(
				this.queue[qnum].findIndex((o) => o.id === id),
				1,
			)
		},
		async todoing(f = true) {
			// 如果进行队列不为空，则先将运行完的任务插入下一队列或者完成队列
			if (!_.isEmpty(this.doing)) {
				if (this.doing.total === this.doing.done) {
					this.done.push(_.omit(this.doing, 'qn'))
				} else {
					this.push(
						Math.min(this.doing.qn + 1, this.queue.length - 1),
						_.omit(this.doing, 'qn'),
					)
				}
				this.doing = {} as Progress & { qn: number }
				// 人为延时
				await sleep(1)
			}
			// 插入下一候选任务
			if (f) {
				for (let v = 0; v < this.queue.length; v++) {
					if (!_.isEmpty(this.queue[v])) {
						this.doing = { ...this.shift(v)!, qn: v }
						break
					}
					if (v === this.queue.length - 1) {
						return false
					}
				}
			}
			return true
		},
	},
})
