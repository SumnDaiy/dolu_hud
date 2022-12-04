import React, { useState } from 'React'
import { Center, Group, RingProgress, ThemeIcon } from '@mantine/core'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { fetchNui } from '../utils/fetchNui'
import { BiBrain, BiHeart, BiMicrophone, BiShield } from 'react-icons/bi'
import { TbDroplet, TbGlass, TbLungs, TbMeat, TbRadio } from 'react-icons/tb'
import { IoSkullOutline } from 'react-icons/io5'
import Config from '../Config.json'

interface HudProps {
	toggle?: boolean
	talking?: number
	voice?: number
	health?: number
	armour?: number
	oxygen?: number
	statuses?: {
		hunger?: number
		thirst?: number
		stress?: number
		drunk?: number
	}
}

const Hud: React.FC = () => {
	// Visibility
	const [visible, setVisible] = useState<boolean>(false)
	useNuiEvent('toggleVisibility', (value: boolean) => setVisible(value))

	// Progress states
	const [isTalkingRadio, setTalkingRadio] = useState<number>(0)
	const [voiceLevel, setVoiceLevel] = useState<number>(0)
	const [health, setHealth] = useState<number>(100)
	const [armour, setArmour] = useState<number>(0)
	const [hunger, setHunger] = useState<number>(0)
	const [thirst, setThirst] = useState<number>(0)
	const [stress, setStress] = useState<number>(0)
	const [drunk, setDrunk] = useState<number>(0)
	const [oxygen, setOxygen] = useState<number>(100)

	// Colors states
	const [healthColor, setHealthColor] = useState<string>(Config.colors.health)
	const [armourColor, setArmourColor] = useState<string>(Config.colors.armour)
	const [hungerColor, setHungerColor] = useState<string>(Config.colors.hunger)
	const [thirstColor, setThirstColor] = useState<string>(Config.colors.thirst)
	const [stressColor, setStressColor] = useState<string>(Config.colors.stress)
	const [drunkColor, setDrunkColor] = useState<string>(Config.colors.drunk)
	const [oxygenColor, setOxygenColor] = useState<string>(Config.colors.oxygen)

	// Set values from client script
	useNuiEvent('setStatuses', (data: HudProps) => {
		if (data.toggle !== undefined) {
			setVisible(data.toggle)
			if (data.toggle === true) fetchNui('nuiReady')
		}
		if (data.talking !== undefined) {
			setTalkingRadio(data.talking)
		}
		if (data.voice !== undefined) {
			setVoiceLevel(data.voice*33.3333)
		}
		if (data.health !== undefined) {
			setHealth(data.health)
			if (data.health !== health) setHealthColor(data.health > 10 ? Config.colors.health : 'red')
		}
		if (data.armour !== undefined) {
			setArmour(data.armour)
			if (data.armour !== armour) setArmourColor(data.armour < 95 ? Config.colors.armour : 'red')
		}
		if (data.oxygen !== undefined) {
			setOxygen(data.oxygen)
			if (data.oxygen !== oxygen) setOxygenColor(data.oxygen > 10 ? Config.colors.oxygen : 'red')
		}
		if (data.statuses !== undefined) {
			const status = data.statuses
			if (status.hunger !== undefined) {
				setHunger(status.hunger)
				if (status.hunger !== hunger) setHungerColor(status.hunger < 95 ? Config.colors.hunger : 'red')
			}
			if (status.thirst !== undefined) {
				setThirst(status.thirst)
				if (status.thirst !== thirst) setThirstColor(status.thirst < 95 ? Config.colors.thirst : 'red')
			}
			if (status.stress !== undefined) {
				setStress(status.stress)
				if (status.stress !== stress) setStressColor(status.stress < 95 ? Config.colors.stress : 'red')
			}
			if (status.drunk !== undefined) {
				setDrunk(status.drunk)
				if (status.drunk !== drunk) setDrunkColor(status.drunk < 95 ? Config.colors.drunk : 'red')
			}
		}
	})

	return (
		<>
		{visible && <Group spacing={0} style={{ position: 'absolute', bottom: '0' }}>
		{/* VOICE */}
		{voiceLevel > 0 && <RingProgress sections={[{ value: voiceLevel, color: Config.colors.voice }]} thickness={6} size={55} roundCaps
		label={
			<Center>
			<ThemeIcon color={Config.colors.voice} variant='light' radius='xl' size={44}>
			{isTalkingRadio > 0 ? <TbRadio size={23} /> : <BiMicrophone size={23} /> }
			</ThemeIcon>
			</Center>
		}
		/>}

		{/* HEALTH */}
		{health !== undefined && <RingProgress sections={[{ value: health, color: healthColor }]} thickness={6} size={55} roundCaps
		label={
			<Center>
			<ThemeIcon color={healthColor} variant='light' radius='xl' size={44}>
			{health > 0 ? <BiHeart size={23} /> : <IoSkullOutline size={23} />}
			</ThemeIcon>
			</Center>
		}
		/>}

		{/* ARMOR */}
		{armour > 0 && <RingProgress sections={[{ value: armour, color: 'blue' }]} thickness={6} size={55} roundCaps
		label={
			<Center>
			<ThemeIcon color='blue' variant='light' radius='xl' size={44}>
			<BiShield size={23} />
			</ThemeIcon>
			</Center>
		}
		/>}

		{/* HUNGER */}
		{hunger > 5 &&
			<RingProgress sections={[{ value: hunger, color: hungerColor }]} thickness={6} size={55} roundCaps
			label={
				<Center>
				<ThemeIcon color={hungerColor} variant='light' radius='xl' size={44}>
				<TbMeat size={23} />
				</ThemeIcon>
				</Center>
			}
			/>
		}

		{/* THIRST */}
		{thirst > 5 &&
			<RingProgress sections={[{ value: thirst, color: thirstColor }]} thickness={6} size={55} roundCaps
			label={
				<Center>
				<ThemeIcon color={thirstColor} variant='light' radius='xl' size={44}>
				<TbDroplet size={23} />
				</ThemeIcon>
				</Center>
			}
			/>
		}

		{/* STRESS */}
		{stress > 5 &&
			<RingProgress sections={[{ value: stress, color: stressColor }]} thickness={6} size={55} roundCaps
			label={
				<Center>
				<ThemeIcon color={stressColor} variant='light' radius='xl' size={44}>
				<BiBrain size={23} />
				</ThemeIcon>
				</Center>
			}
			/>
		}

		{/* DRUNK */}
		{drunk > 5 &&
			<RingProgress sections={[{ value: drunk, color: drunkColor }]} thickness={6} size={55} roundCaps
			label={
				<Center>
				<ThemeIcon color={drunkColor} variant='light' radius='xl' size={44}>
				<TbGlass size={23} />
				</ThemeIcon>
				</Center>
			}
			/>
		}

		{/* OXYGEN */}
		{oxygen < 100 && <RingProgress sections={[{ value: oxygen, color: oxygenColor }]} thickness={6} size={55} roundCaps
		label={
			<Center>
			<ThemeIcon color={oxygenColor} variant='light' radius='xl' size={44}>
			<TbLungs size={23} />
			</ThemeIcon>
			</Center>
		}
		/>}

		</Group>}
		</>
		)
	}

	export default Hud
