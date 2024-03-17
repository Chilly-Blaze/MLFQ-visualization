<template>
	<n-card title="已完成" class="done">
		<TransitionGroup name="fade" class="container">
			<Progress v-for="(item, i) in store.done" :key="item.id" :p="item">
				<template #close>
					<n-button text @click="store.done.splice(i, 1)">
						<template #icon>
							<n-icon>
								<checkmark />
							</n-icon>
						</template>
					</n-button>
				</template>
			</Progress>
		</TransitionGroup>
	</n-card>
</template>

<script setup lang="ts">
	import { Checkmark } from '@vicons/ionicons5'
	import { NButton, NIcon, NCard } from 'naive-ui'
	import { useStore } from '@/pinia'
	import Progress from './Progress.vue'
	const store = useStore()
</script>

<style lang="scss" scoped>
	.done {
		position: relative;
		overflow: auto;
		height: 250px;
		width: 100%;
		.container {
			margin: 15px;
			position: relative;
			width: 100%;
			padding: 0;
		}

		/* 1. 声明过渡效果 */
		.fade-move,
		.fade-enter-active,
		.fade-leave-active {
			transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
		}

		/* 2. 声明进入和离开的状态 */
		.fade-enter-from,
		.fade-leave-to {
			opacity: 0;
		}
	}
</style>
