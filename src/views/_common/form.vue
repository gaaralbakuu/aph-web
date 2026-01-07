<template>
	<el-form :model="data" v-bind="formProps">
		<el-row v-bind="formProps">
			<el-col v-for="(f,index) in fields" :key="index" :span="f.span ? f.span : 24" v-if="!f.hidden" :offset="f.offset ? f.offset : 0">
				<el-form-item :prop="f.key">
					<template #label>
							<span>
								<span v-if="f.required" class="text-red">*</span>
								<el-tooltip v-if="f.tips" :content="f.tips" placement="top">
									<div class="inlineBlock text-blue pointer">{{f.name=='checkbox'?'':f.title}}</div>
								</el-tooltip>
								<span v-else>{{f.name=='checkbox'?'':f.title}}</span>
							</span>
						</template>
						<el-input v-if="f.name=='textarea'" type="textarea" v-bind="f.props" v-on="f.events||{}"
							v-model="data[f.key]"></el-input>
						<el-date-picker v-else-if="f.name=='date'" v-model="data[f.key]" style="width: 100%"
							v-bind="f.props" v-on="f.events||{}">
						</el-date-picker>
						<el-button v-else-if="f.name=='button'" v-bind="f.props" v-on="f.events||{}">{{f.value}}
						</el-button>
						<el-time-picker v-else-if="f.name=='time'" v-model="data[f.key]" style="width: 100%"
							v-bind="f.props" v-on="f.events||{}">
						</el-time-picker>
						<template v-else-if="f.name=='radio'">
							<el-radio v-for="o in f.options||[]" :key="o.value" v-model="data[f.key]" :label="o.value"
								v-bind="f.props">
								{{o.label}}
							</el-radio>
						</template>
						<el-checkbox v-else-if="f.name=='checkbox'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}">
							{{f.title||''}}
						</el-checkbox>
						<el-checkbox-group v-else-if="f.name=='checkboxGroup'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}">
							<el-checkbox v-for="o in f.options||[]" :label="o.value" :key="o.value">{{o.label}}
							</el-checkbox>
						</el-checkbox-group>
						<el-switch v-else-if="f.name=='switch'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}">
						</el-switch>
						<el-select v-else-if="f.name=='select'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}" style="width: 100%">
							<el-option v-for="o in f.options||[]" :key="o.value" :label="o.label" :value="o.value">
							</el-option>
						</el-select>
						<el-select v-else-if="f.name=='selectObj'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}" style="width: 100%">
							<el-option v-for="o in f.options||[]" :key="o.value" :label="o.label" :value="o">
							</el-option>
						</el-select>
						<dynamic-tag v-else-if="f.name=='dynamicTag'" v-model="data[f.key]" v-bind="f.props">
						</dynamic-tag>
						<img-uploader v-else-if="f.name=='imgUploader'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}">
						</img-uploader>
						<el-upload v-else-if="f.name=='fileUploader'" :file-list="data[f.key]" v-bind="f.props">
							<el-button type="primary">点击上传</el-button>
							<template #tip>
								<div v-show="f.tips" class="el-upload__tip">{{f.tips}}</div>
							</template>
						</el-upload>
						<el-input-number v-else-if="f.name=='number'" v-model="data[f.key]" v-bind="f.props"
							v-on="f.events||{}">
						</el-input-number>
						<el-input v-else v-model="data[f.key]" v-bind="f.props" v-on="f.events||{}"></el-input>
					</el-form-item>
				</el-col>
		</el-row>
	</el-form>
</template>

<script>
	import ImgUploader from '@/components/Img/Uploader.vue'
	import DynamicTag from '@/components/Tag/Dynamictag.vue'

	export default {
		name: 'z-form',
		components: {
			DynamicTag,
			ImgUploader
		},
		props: {
			fields: {
				type: Array,
				default: null
			},
			data: {
				type: Object,
				default: null
			},
			formProps: {
				type: Object,
				default: null
			},
		},
	}
</script>

<style scoped>
</style>
