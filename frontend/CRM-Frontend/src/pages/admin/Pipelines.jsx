import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePipelineOpen, setIsCreatePipelineOpen] = useState(false);
  const [isEditPipelineOpen, setIsEditPipelineOpen] = useState(false);
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
  const [isEditStageOpen, setIsEditStageOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [pipelineName, setPipelineName] = useState('');
  const [stageName, setStageName] = useState('');
  const [stageColor, setStageColor] = useState('#3b82f6');

  const fetchPipelines = async () => {
    try {
      const res = await api.get('/pipelines');
      setPipelines(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  // ========== PIPELINE CRUD ==========

  const handleCreatePipeline = async (e) => {
    e.preventDefault();
    if (!pipelineName.trim()) return;
    try {
      await api.post('/pipelines', { name: pipelineName });
      toast.success("Pipeline created");
      setIsCreatePipelineOpen(false);
      setPipelineName('');
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to create pipeline");
    }
  };

  const handleEditPipeline = async (e) => {
    e.preventDefault();
    if (!pipelineName.trim() || !selectedPipeline) return;
    try {
      await api.put(`/pipelines/${selectedPipeline.id}`, { name: pipelineName });
      toast.success("Pipeline updated");
      setIsEditPipelineOpen(false);
      setSelectedPipeline(null);
      setPipelineName('');
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to update pipeline");
    }
  };

  const handleDeletePipeline = async (id) => {
    if (!window.confirm('Are you sure? This will delete all stages and unlink leads in this pipeline.')) return;
    try {
      await api.delete(`/pipelines/${id}`);
      toast.success("Pipeline deleted");
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to delete pipeline");
    }
  };

  const openEditPipeline = (pipeline) => {
    setSelectedPipeline(pipeline);
    setPipelineName(pipeline.name);
    setIsEditPipelineOpen(true);
  };

  // ========== STAGE CRUD ==========

  const handleCreateStage = async (e) => {
    e.preventDefault();
    if (!stageName.trim() || !selectedPipeline) return;
    try {
      await api.post(`/pipelines/${selectedPipeline.id}/stages`, {
        name: stageName,
        color: stageColor
      });
      toast.success("Stage created");
      setIsCreateStageOpen(false);
      setStageName('');
      setStageColor('#3b82f6');
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to create stage");
    }
  };

  const openCreateStage = (pipeline) => {
    setSelectedPipeline(pipeline);
    setStageName('');
    setStageColor('#3b82f6');
    setIsCreateStageOpen(true);
  };

  const handleEditStage = async (e) => {
    e.preventDefault();
    if (!stageName.trim() || !selectedStage) return;
    try {
      await api.put(`/pipelines/stages/${selectedStage.id}`, {
        name: stageName,
        color: stageColor
      });
      toast.success("Stage updated");
      setIsEditStageOpen(false);
      setSelectedStage(null);
      setStageName('');
      setStageColor('#3b82f6');
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to update stage");
    }
  };

  const openEditStage = (stage) => {
    setSelectedStage(stage);
    setStageName(stage.name);
    setStageColor(stage.color || '#3b82f6');
    setIsEditStageOpen(true);
  };

  const handleDeleteStage = async (id) => {
    if (!window.confirm('Are you sure? Leads in this stage will be unlinked.')) return;
    try {
      await api.delete(`/pipelines/stages/${id}`);
      toast.success("Stage deleted");
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to delete stage");
    }
  };

  const moveStageUp = async (stage, stages) => {
    const index = stages.findIndex(s => s.id === stage.id);
    if (index <= 0) return;
    const prevStage = stages[index - 1];
    try {
      await api.put(`/pipelines/stages/${stage.id}/reorder`, { order: prevStage.order });
      await api.put(`/pipelines/stages/${prevStage.id}/reorder`, { order: stage.order });
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  const moveStageDown = async (stage, stages) => {
    const index = stages.findIndex(s => s.id === stage.id);
    if (index >= stages.length - 1) return;
    const nextStage = stages[index + 1];
    try {
      await api.put(`/pipelines/stages/${stage.id}/reorder`, { order: nextStage.order });
      await api.put(`/pipelines/stages/${nextStage.id}/reorder`, { order: stage.order });
      fetchPipelines();
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading pipelines...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#004c4c]">Pipeline Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage pipelines and their stages</p>
        </div>
        <Button
          onClick={() => {
            setPipelineName('');
            setIsCreatePipelineOpen(true);
          }}
          className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold"
        >
          <Plus className="h-4 w-4 mr-2" /> New Pipeline
        </Button>
      </div>

      {pipelines.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No pipelines yet</p>
          <p className="text-sm mt-1">Create your first pipeline to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pipelines.map(pipeline => (
            <Card key={pipeline.id} className="border border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 py-4 px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-[#004c4c]">
                    {pipeline.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCreateStage(pipeline)}
                      className="text-xs font-semibold text-[#008080] border-[#008080]/30 hover:bg-[#b2d8d8]/20 rounded-lg"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Stage
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditPipeline(pipeline)}
                      className="h-8 w-8 text-slate-400 hover:text-[#008080]"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePipeline(pipeline.id)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(pipeline.stages || []).map((stage, index, arr) => (
                    <div
                      key={stage.id}
                      className="relative group border rounded-xl p-4 bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: stage.color || '#3b82f6' }}
                        />
                        <span className="font-semibold text-sm text-slate-800">{stage.name}</span>
                      </div>
                      <div className="text-xs text-slate-400">Order: {stage.order}</div>
                      
                      {/* Stage actions */}
                      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={() => moveStageUp(stage, arr)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveStageDown(stage, arr)}
                          disabled={index === arr.length - 1}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => openEditStage(stage)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500"
                          title="Edit stage"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteStage(stage.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"
                          title="Delete stage"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE PIPELINE DIALOG */}
      <Dialog open={isCreatePipelineOpen} onOpenChange={setIsCreatePipelineOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#004c4c]">Create New Pipeline</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePipeline} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Name</label>
              <Input
                placeholder="e.g. Website Sales, Real Estate"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]"
                required
                autoFocus
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreatePipelineOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-semibold">Create Pipeline</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT PIPELINE DIALOG */}
      <Dialog open={isEditPipelineOpen} onOpenChange={setIsEditPipelineOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#004c4c]">Edit Pipeline</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditPipeline} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Name</label>
              <Input
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditPipelineOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-semibold">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE STAGE DIALOG */}
      <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#004c4c]">
              Add Stage to "{selectedPipeline?.name}"
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateStage} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Stage Name</label>
              <Input
                placeholder="e.g. New, Contacted, Won"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={stageColor}
                  onChange={(e) => setStageColor(e.target.value)}
                  className="h-10 w-16 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-sm text-slate-500">{stageColor}</span>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateStageOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-semibold">Create Stage</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT STAGE DIALOG */}
      <Dialog open={isEditStageOpen} onOpenChange={setIsEditStageOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#004c4c]">Edit Stage</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditStage} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Stage Name</label>
              <Input
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={stageColor}
                  onChange={(e) => setStageColor(e.target.value)}
                  className="h-10 w-16 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-sm text-slate-500">{stageColor}</span>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditStageOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-semibold">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pipelines;