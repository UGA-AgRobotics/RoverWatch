#!/usr/bin/env python

import rospy
import subprocess
import os



class RoverWatchRosNode:

	def __init__(self):
		self.node_name = "rover_watch"
		rospy.init_node(self.node_name)
		rospy.spin()

	def launch_rover_watch(self):
		"""
		Deploys rover watch nodejs app using subprocess.
		"""
        self.p = subprocess.Popen(["npm", "run", "envify-deploy"], stdout=subprocess.PIPE)

    def stop_rover_watch(self):
    	"""
    	Stops rover watch nodejs server (TODO).
    	"""
    	pass



if __name__ == '__main__':

	try:
		rw = RoverWatchRosNode()
		rw.launch_rover_watch()
	except rospy.ROSInterruptException as e:
		print("{}".format(e))
		pass